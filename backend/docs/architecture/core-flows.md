# Steerigo Backend — Core Runtime & Business Flows

---

## 1. Flow: User Authentication, OTP Lifecycle & Session Rotation

### Flow Purpose
Registers new users, delivers and verifies 4-digit numeric OTPs via email, issues short-lived JWT access tokens and rolling refresh tokens in secure cookies, and handles stateful session verification.

### Entry Point
- `POST /api/auth/signup/request`
- `POST /api/auth/signup/verify`
- `POST /api/auth/login`
- `POST /api/auth/refresh-token`
- `POST /api/auth/logout`
- Router: `src/interface/routes/auth/AuthRoutes.ts`

### Request & Event Path
```
Client Request
      │
      ▼
[signupRequestSchema (Zod)] ──► Validates email format, password strength, 10-digit mobile
      │
      ▼
[SignupController.signupRequest]
      │
      ▼
[SignupRequestUseCase.execute]
      ├─ userRepository.findByEmail(email)
      ├─ OtpService.generate() (4 digits)
      ├─ CryptoAdapter.hashOtp(otp)
      ├─ PasswordService.hash(password)
      ├─ user.create({ status: PENDING_VERIFICATION })
      ├─ userRepository.save(user)
      └─ EmailService.sendVerificationOtp(email, otp)
```

### Validation & Auth
- **Zod Schema**: Ensures password contains uppercase, lowercase, numeric, and special characters. Mobile number is exactly 10 digits.
- **Stateful Auth Check (`authMiddleware`)**: On protected routes, verifies access token, executes `userRepository.findById(payload.userId)`, and evaluates `user.canLogin()`. Banned, deleted, or unverified accounts are rejected with HTTP 401.

### State Transitions
$$\text{NON-EXISTENT} \xrightarrow{\text{Signup Request}} \text{PENDING\_VERIFICATION} \xrightarrow{\text{Submit Valid OTP}} \text{ACTIVE}$$

### State Expiration & Failure Handling
- **OTP Expiration**: OTP has a default TTL of 120 seconds (`OTP_TTL_SECONDS`). Submitting after expiration throws `OtpExpiredError` (HTTP 400).
- **Max Attempts**: Each incorrect OTP increments `otpAttempts`. Reaching 5 attempts throws `MaxOtpAttemptsError` (HTTP 400), locking the OTP.
- **Refresh Token Rotation**: Refresh token is stored hashed in MongoDB (`RefreshTokenModel`). Invoking `RefreshTokenUseCase` validates the token, revokes the old token (`isRevoked = true`), and issues a new pair.

### Important Files
- `src/interface/controllers/auth/SignupController.ts`
- `src/application/use-cases/auth/SignupRequestUseCase.ts`
- `src/application/use-cases/auth/SignupVerifyUseCase.ts`
- `src/domain/entities/User.ts`
- `src/infrastructure/services/EmailService.ts`
- `src/infrastructure/services/TokenService.ts`

---

## 2. Flow: Driver Onboarding, KYC Verification & Activation

### Flow Purpose
Enables an existing rider to register as a driver, upload identity and driving license proofs, undergo administrative compliance verification, and activate recurring availability schedules.

### Entry Point
- `POST /api/user/register-driver`
- `POST /api/driver/kyc/submit`
- `POST /api/admin/driver/kyc/update-status`
- Routers: `userRoutes.ts`, `driverRoutes.ts`, `adminDriverRoutes.ts`

### Flow Architecture
```
[Rider] ──► Register as Driver ──► User.role updated to DRIVER, Driver created (status: UNVERIFIED)
   │
   ▼
[Upload KYC Documents] ──► Multer (Memory) ──► CloudinaryService.upload ──► KYC entity created
   │
   ▼
[Admin Dashboard] ──► Admin audits documents ──► UpdateDriverKycStatusUseCase
   │
   ├─ If Approved:
   │    ├─ Driver.status = AVAILABLE, Driver.kycStatus = APPROVED
   │    ├─ Creates Driver Wallet (ownerType: DRIVER)
   │    ├─ Creates DriverAvailability record (with 2dsphere indexes)
   │    └─ NotificationRealtimePublisher emits alert to socket user:{driverUserId}
   │
   └─ If Rejected:
        └─ Driver.status = REJECTED with rejection reason logged
```

### Domain Business Logic & Invariants
- `SubmitKYCUseCase` validates that license expiry date is strictly in the future and license issue date is strictly in the past.
- Gear types (`MANUAL`, `AUTOMATIC`) and body types (`SEDAN`, `SUV`, `HATCHBACK`) are validated against permissible vehicle categories.

### State Transitions
* **Driver Status**: $\text{UNVERIFIED} \xrightarrow{\text{Submit KYC}} \text{PENDING} \xrightarrow{\text{Admin Approve}} \text{AVAILABLE}$ (or $\text{REJECTED}$).
* **KYC Status**: $\text{PENDING} \rightarrow \text{APPROVED}$ or $\text{REJECTED}$.

### Important Files
- `src/application/use-cases/user/RegisterUserAsDriverUseCase.ts`
- `src/application/use-cases/driver/SubmitKYCUseCase.ts`
- `src/application/use-cases/admin/UpdateDriverKycStatusUseCase.ts`
- `src/domain/entities/Driver.ts`
- `src/domain/entities/KYC.ts`
- `src/infrastructure/services/CloudinaryService.ts`

---

## 3. Flow: Instant Ride Discovery & Sequential Candidate Dispatching

### Flow Purpose
Locates available, verified drivers within a geographic radius matching vehicle specifications and sequentially dispatches instant ride requests one driver at a time with strict timeout escalation.

### Entry Point
- `POST /api/user/ride/auto-search-request`
- Router: `src/interface/routes/user/rideRoutes.ts`

### Request & Event Path
```
Rider Client
     │
     ▼
[AutoRideController.autoSearchAndSendRideRequest]
     │
     ▼
[AutoSearchAndSendRideRequestUseCase]
     ├─ FareCalculationService.calculateFare() (baseline fare + GST + platform fee)
     ├─ driverAvailabilityRepository.findNearbyAvailableDrivers() ($geoNear aggregation)
     ├─ Creates RideRequestGroup (candidateDriverIds: [id0, id1, ...], currentIndex: 0, status: ACTIVE)
     ├─ rideRequestGroupRepository.save(group)
     ├─ RideSearchDispatchService.scheduleGroupGuards(groupId)
     │    ├─ BullMQ: GROUP_NOTIFY_NO_DRIVER (delay: 180s)
     │    └─ BullMQ: GROUP_HARD_EXPIRE (delay: 240s)
     └─ RideSearchDispatchService.dispatchNextRequest(groupId, 0)
```

### Dispatch Escalation & Queue Mechanics
```
[RideSearchDispatchService.dispatchNextRequest(groupId, index)]
     │
     ▼
Acquires Redis Lock: lock:ride:group:dispatch:{groupId} (TTL: 10s)
     │
     ├─ Creates RideRequest for driver[index] (status: PENDING)
     ├─ BullMQ: Adds REQUEST_TIMEOUT job (delay: 45s) on queue "ride-search"
     ├─ Redis Pub/Sub: Publishes to PUBSUB_CHANNELS.RIDE_REQUEST_CREATED
     ├─ Redis Pub/Sub: Publishes to PUBSUB_CHANNELS.RIDE_SEARCH_PROGRESS
     └─ Releases Redis Lock
          │
          ▼
[WorkerSocketBridge in app.ts]
     ├─ Catches RIDE_REQUEST_CREATED ──► io.to("driver:{driverUserId}").emit("driver:request:created")
     └─ Catches RIDE_SEARCH_PROGRESS ──► io.to("rider:{riderId}").emit("ride:search:progress")
```

### Escalation Branches
1. **Branch A (Driver Accepts)**: Handled via `AcceptRideRequestUseCase`. Redis lock acquired, request marked `ACCEPTED`, group marked `COMPLETED`, BullMQ jobs cancelled, `Ride` created.
2. **Branch B (Driver Rejects)**: Driver calls `RejectRideRequestUseCase`. Request marked `REJECTED`, BullMQ timeout job removed, immediately triggers `dispatchNextRequest(groupId, index + 1)`.
3. **Branch C (Driver Times Out)**: `RideRequestTimeoutWorker` (`worker.ts`) receives BullMQ timeout job after 45s. Acquires lock, marks request `EXPIRED`, triggers `dispatchNextRequest(groupId, index + 1)`.
4. **Branch D (Candidates Exhausted)**: If `index >= candidates.length`, `expireGroupAndNotify` sets group status to `EXHAUSTED`, cancels queue guards, and publishes `PUBSUB_CHANNELS.RIDE_NO_DRIVER_FOUND` $\rightarrow$ rider receives notification and socket event.

### State Transitions
* **RideRequestGroup**: $\text{ACTIVE} \xrightarrow{\text{Accept}} \text{COMPLETED}$ or $\xrightarrow{\text{Exhausted/Timeout}} \text{EXHAUSTED}$.
* **RideRequest**: $\text{PENDING} \xrightarrow{\text{Accept}} \text{ACCEPTED}$ or $\xrightarrow{\text{Reject}} \text{REJECTED}$ or $\xrightarrow{\text{Timeout}} \text{EXPIRED}$.

### High-Risk Considerations
* **Concurrency Collision**: If driver rejects at second 44.9 and BullMQ timeout fires simultaneously at second 45.0, Redis lock `lock:ride:group:dispatch:{groupId}` prevents double advancement of `currentIndex`.
* **Worker Process Dependency**: If `worker.ts` is stopped, timeouts will not execute, permanently leaving candidate 0 in `PENDING`.

---

## 4. Flow: Ride Acceptance, In-Ride Verification & Dynamic Completion

### Flow Purpose
Transitions an accepted ride request into an active trip, verifies passenger pickup via a 4-digit code, tracks trip duration, and dynamically computes final billable fare upon completion.

### Entry Point
- Accept: `POST /api/driver/ride/accept-request`
- Arrive: `POST /api/driver/ride/mark-arrived`
- Start: `POST /api/driver/ride/mark-started`
- Complete: `POST /api/driver/ride/mark-completed`
- Router: `src/interface/routes/driver/DriverRideRoutes.ts`

### State Machine Lifecycle
$$\text{REQUESTED} \xrightarrow{\text{Accept}} \text{ACCEPTED} \xrightarrow{\text{Arrive}} \text{ARRIVED} \xrightarrow{\text{Verify OTP + Start}} \text{STARTED} \xrightarrow{\text{Complete}} \text{COMPLETED}$$

```
[Driver accepts request]
      │
      ▼
[AcceptRideRequestUseCase]
  ├─ Acquires Redis lock: lock:ride:accept:{requestId}
  ├─ atomicAcceptRideRequest(requestId) ({ status: PENDING } -> { status: ACCEPTED })
  ├─ Cancels other requests in group & cancels group BullMQ jobs
  ├─ Generates 4-digit numeric verificationCode via OtpService
  ├─ Creates Ride entity (status: ACCEPTED, timeline.acceptedAt = now)
  ├─ Calls CreateRideChatRoomUseCase (initializes chat room between rider and driver)
  └─ Emits RideAcceptedEvent over Socket.IO to rider:{riderId} and driver:{driverUserId}
      │
      ▼
[Driver arrives at pickup]
      │
      ▼
[MarkRideAsArrivedUseCase]
  ├─ Verifies driver owns ride
  ├─ ride.setStatusToArrived() (timeline.arrivedAt = now)
  └─ Emits RideArrivedEvent to rider
      │
      ▼
[Rider shares 4-digit OTP with driver]
      │
      ▼
[MarkRideAsStartedUseCase]
  ├─ Checks: ride.getVerificationCode() === dto.verificationCode
  ├─ ride.setStatusToStarted() (timeline.startedAt = now)
  └─ Emits RideStartedEvent to rider
      │
      ▼
[Driver arrives at destination]
      │
      ▼
[MarkRideAsCompletedUseCase]
  ├─ actualDuration = ceil((completedAt - startedAt) in minutes)
  ├─ finalDuration = Math.max(bookedDuration, actualDuration)
  ├─ FareCalculationService.calculateFare(finalDuration) (recalculates fare + GST + platform fee)
  ├─ If coupon applied: CouponValidationService.validateAndCalculate() re-evaluates discount
  ├─ ride.completeWithFareBreakdown(finalFareBreakdown) (timeline.completedAt = now)
  ├─ BullMQ: Schedules chat room expiry in "chat-room-expiry" queue
  └─ Emits RideCompletedEvent
```

### High-Risk Considerations
* **OTP Bypass Risk**: A driver cannot mark a ride as `STARTED` without submitting the exact numeric verification code generated during ride creation.
* **Dynamic Fare Recalculation**: If traffic causes a ride to exceed the booked duration, `Math.max` guarantees the driver and platform are compensated for the extra time. The rider's payable amount increases accordingly.

---

## 5. Flow: Scheduled / Future Advance Bookings

### Flow Purpose
Allows riders to schedule rides hours or days in advance, simultaneously broadcasting requests to all eligible drivers matching by base location, with conflict prevention.

### Entry Point
- `POST /api/user/ride/schedule`
- `POST /api/driver/ride/accept-future-request`
- Routers: `user/rideRoutes.ts`, `driver/DriverRideRoutes.ts`

### Request & Event Path
```
Rider Client
     │
     ▼
[ScheduleFutureRideRequestUseCase]
     ├─ driverAvailabilityRepository.findNearbyAvailableDriversByBaseLocation()
     ├─ Calculates estimated fare
     ├─ Creates broadcast group of FutureRideRequest records (status: PENDING)
     ├─ BullMQ: Schedules group expiry in "future-ride-expiry" queue
     └─ Broadcasts alert to all matched driver sockets
```

### Acceptance & Conflict Handling
```
Driver Client clicks Accept
     │
     ▼
[AcceptFutureRideRequestUseCase]
     ├─ Acquires Redis Lock: future_ride_accept_lock:{requestId}
     ├─ rideRepository.hasTimeSlotConflict(driverId, pickupTime, duration)
     │    (Ensures driver has no overlapping active or scheduled rides)
     ├─ Marks winning driver's FutureRideRequest as ACCEPTED
     ├─ futureRideRequestRepository.cancelAllPendingInGroup(requestGroupId)
     │    (Atomically cancels all other candidate drivers' requests)
     ├─ Cancels BullMQ group expiry job
     ├─ Emits FutureRideRequestCancelledForDriver to all other drivers
     └─ Creates Ride entity (BookingType: SCHEDULED, status: ACCEPTED)
```

### Important Files
- `src/application/use-cases/user/ScheduleFutureRideRequestUseCase.ts`
- `src/application/use-cases/driver/AcceptFutureRideRequestUseCase.ts`
- `src/infrastructure/workers/FutureRideExpiryWorker.ts`
- `src/domain/entities/FutureRideRequest.ts`

---

## 6. Flow: Ride Cancellation & Financial Penalties

### Flow Purpose
Permits riders or drivers to cancel bookings, applying dynamic cancellation fees or penalties based on elapsed time and driver arrival status.

### Entry Point
- Rider: `POST /api/user/ride/:rideId/cancel`
- Driver: `POST /api/driver/ride/:rideId/cancel`

### Execution Path & Penalty Rules
1. **Rider Cancellation (`CancelRideUseCase`)**:
   - Validates ride is not already completed or started (`ride.isStarted()` cannot be cancelled by rider).
   - Checks if driver arrived (`ride.getArrivedAt()`).
   - Evaluates grace period (`GRACE_PERIOD_MINUTES = 2`):
     - **Free Cancellation**: If driver has not arrived, or if cancelled within 2 minutes of driver arrival.
     - **Cancellation Fee**: If cancelled $>$ 2 minutes after driver arrival.
   - Resets ride fare breakdown to the cancellation fee via `ride.cancelWithFareBreakdown(fee)`.
   - Sets status to `CANCELLED` (timestamps `timeline.cancelledAt`).
   - Emits `RideCancelledEvent` over Socket.IO to `driver:${driverUserId}`.
2. **Driver Cancellation (`DriverCancelRideUseCase`)**:
   - Driver provides cancellation reason.
   - If driver cancels without valid exemption after accepting, a driver penalty is calculated via `CancellationChargeService`.
   - Debits driver wallet penalty and credits platform revenue via `EarningsDistributionService.distributeCancellation()`.

---

## 7. Flow: Payment Processing & Double-Entry Ledger Settlement

### Flow Purpose
Settles ride fares via online payment (Razorpay) or cash-on-delivery, records multi-wallet double-entry ledger transactions, and accounts for platform-funded promotional coupons.

### Entry Point
- Online Payment Verification: `POST /api/payment/verify` (called by Rider)
- Cash Payment Confirmation: `POST /api/payment/confirm-cash` (called by Driver)
- Router: `src/interface/routes/payment/paymentRoutes.ts`

### Online vs. Cash Ledger Distribution (`EarningsDistributionService`)

```
========================================================================================
ONLINE PAYMENT PATH (Razorpay)
========================================================================================
Rider pays online via Razorpay (payableAmount = totalFare - discount)
RazorpayService.verifySignature() validates HMAC-SHA256 signature
  ├─ 1. Audit Transaction: PLATFORM receives payableAmount (type: RIDER_PAYMENT_ONLINE)
  ├─ 2. Debit PLATFORM Wallet: coupon discount (type: COUPON_EXPENSE)
  ├─ 3. Debit PLATFORM Wallet: driverEarnings (type: DRIVER_SETTLEMENT)
  ├─ 4. Credit DRIVER Wallet: driverEarnings (type: DRIVER_EARNING)
  ├─ 5. Credit PLATFORM Wallet: platformRevenue (fee + tax) (type: PLATFORM_COMMISSION)
  └─ Publishes PaymentSucceededEvent ──► RecordCouponUsageOnPaymentSucceededHandler

========================================================================================
CASH PAYMENT PATH (Driver collects physical cash)
========================================================================================
Driver collects cash at destination and calls confirmCash
Driver confirms collecting payableAmount (totalFare - discount)
  ├─ 1. Debit DRIVER Wallet: platformRevenue (type: PLATFORM_COMMISSION_CASH_RIDE)
  ├─ 2. Credit PLATFORM Wallet: platformRevenue (type: PLATFORM_COMMISSION)
  ├─ 3. If Coupon Applied:
  │       ├─ Debit PLATFORM Wallet: discount (type: COUPON_EXPENSE)
  │       └─ Credit DRIVER Wallet: discount (type: DRIVER_COUPON_CREDIT)
  │          (Platform reimburses the driver for the rider's discount)
  └─ 4. Audit Transaction: DRIVER collected cash (type: RIDE_PAYMENT_CASH)
```

### High-Risk Considerations
* **Non-Atomic Ledger Writes**: `EarningsDistributionService` executes sequential repository `.save()` calls without Mongoose session binding. If step 3 fails, steps 1 and 2 are committed to the database.

---

## 8. Flow: In-Ride Realtime Chat & Auto-Expiry

### Flow Purpose
Provides real-time messaging between rider and driver during an active ride, tracking delivery and read statuses, and terminating the room post-trip.

### Entry Point
- HTTP: `POST /api/chat-room/message`, `GET /api/chat-room/:roomId/messages`, `PATCH /api/chat-room/messages/read`
- WebSockets: `chat:message:send`
- Router: `src/interface/routes/chat/chatRoutes.ts`

### Execution Path
1. **Room Creation**: Automatically invoked via `CreateRideChatRoomUseCase` inside `AcceptRideRequestUseCase`. Room participants set to `[riderId, driverId]`.
2. **Sending Messages (`SendChatMessageUseCase`)**:
   - Verifies user authorization (checks `chatRoom.isParticipant(userId)` or maps `driver.userId` to `driverId`).
   - Verifies room is not ended (`chatRoom.getStatus() !== ChatRoomStatus.ENDED`).
   - Persists `MessageModel` and `MessageStatusModel`.
   - Emits `ChatMessageSentEvent` $\rightarrow$ `ChatRealtimeService` broadcasts to Socket.IO room `chat:${chatRoomId}`.
3. **Automated Termination**:
   - When ride is marked completed, `MarkRideAsCompletedUseCase` adds a job to BullMQ `chat-room-expiry` queue with a configured delay.
   - `ChatRoomExpiryWorker` (`app.ts`) picks up the job, sets `ChatRoom.status = ENDED`, and broadcasts room closure. Further messages are rejected.

---

## 9. Flow: Driver Payout & Administrative Authorization

### Flow Purpose
Allows drivers to withdraw net earnings from their digital wallet to their bank account, subject to minimum withdrawal limits and administrative approval.

### Entry Point
- Driver Request: `POST /api/driver/payout/request`
- Admin Approval: `POST /api/admin/payout/approve`
- Admin Rejection: `POST /api/admin/payout/reject`

### Execution Path
1. **Payout Request (`RequestPayoutUseCase`)**:
   - Driver requests withdrawal amount (must be $\ge 100$ INR).
   - Validates driver has no existing `PENDING` or `REQUESTED` payout (`findPendingByDriverId`).
   - Verifies driver wallet available balance $\ge$ requested amount.
   - Creates `Payout` entity in `REQUESTED` status.
2. **Admin Approval (`ApprovePayoutUseCase`)**:
   - Admin reviews payout request.
   - Re-checks driver wallet balance.
   - Marks payout `PROCESSING`.
   - Debits driver wallet: `wallet.debit(payoutAmount)` and saves `WalletModel`.
   - Records `Transaction` record (`type: PAYOUT, direction: DEBIT`).
   - Marks payout `COMPLETED` and saves `PayoutModel`.
3. **Admin Rejection (`RejectPayoutUseCase`)**:
   - Admin records rejection reason.
   - Marks payout `REJECTED`. Driver wallet balance remains intact.
