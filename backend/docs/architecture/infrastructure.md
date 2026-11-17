# Steerigo Backend — Infrastructure & External Boundaries

---

## 1. Database Architecture (MongoDB & Mongoose)

### 1.1 Connection Lifecycle
* **Engine**: MongoDB accessed via Mongoose (`^8.0.0`).
* **Connection Manager**: Singleton `DatabaseConnection` in `src/infrastructure/database/repositories/connection.ts`.
* **Configuration Parameters**:
  - `dbName`: Hardcoded to `"steerigo"`. *(Note: overrides any database name specified in the `MONGO_URI` query string).*
  - `maxPoolSize`: 10 connections.
  - `serverSelectionTimeoutMS`: 5,000 ms.
  - `socketTimeoutMS`: 45,000 ms.
* **Connection Handlers**:
  - `error`: Logged via Winston `Logger.error`.
  - `disconnected`: Updates internal state `isConnected = false`.
  - `reconnected`: Restores `isConnected = true`.

### 1.2 Mongoose Models Inventory & Schemas

| Model File | Collection | Responsibility | Primary Key & Identifiers |
|---|---|---|---|
| `UserModel.ts` | `users` | User credentials, roles, email verification status, OTP hashes. | `_id` (`ObjectId`) |
| `DriverModel.ts` | `drivers` | Driver licensing, vehicle eligibility (gear/body), ratings, status. | `_id` (`ObjectId`), `userId` (`ObjectId` $\rightarrow$ `users`) |
| `DriverAvailabilityModel.ts` | `driveravailabilities` | Weekly recurring availability schedules, exceptions, GeoJSON coordinates. | `_id`, `driverId` (`ObjectId` $\rightarrow$ `drivers`) |
| `RideModel.ts` | `rides` | Active and historical rides, state timeline, verification OTP, fare breakdown. | `_id`, `rideId` (`String`, `RIDE-uuid`), `driverId`, `riderId` |
| `RideRequestModel.ts` | `riderequests` | Transient dispatch requests to individual candidate drivers. | `_id`, `requestGroupId`, `driverId`, `driverUserId` |
| `RideRequestGroupModel.ts` | `riderequestgroups` | Transient candidate driver lists and sequential dispatch state. | `_id` (`String`), `riderId`, `candidateDriverIds` |
| `FutureRideRequestModel.ts` | `futureriderequests` | Broadcast requests for advance scheduled bookings. | `_id`, `requestGroupId`, `driverId`, `riderId` |
| `WalletModel.ts` | `wallets` | Account balances for Driver, Rider, and Platform accounts. | `_id`, `ownerId` (`String`), `ownerType` (`DRIVER`, `RIDER`, `PLATFORM`) |
| `TransactionModel.ts` | `transactions` | Double-entry financial audit records. | `_id`, `walletId`, `type`, `direction` (`CREDIT`, `DEBIT`) |
| `PayoutModel.ts` | `payouts` | Driver withdrawal requests and administrative status. | `_id`, `driverId`, `amount`, `status` |
| `CouponModel.ts` | `coupons` | Promotional discount campaigns, caps, and rules. | `_id`, `code` (`String`, uppercase) |
| `CouponUsageModel.ts` | `couponusages` | Audit log of rider coupon redemptions. | `_id`, `couponId`, `userId`, `rideId` |
| `ChatRoomModel.ts` | `chatrooms` | In-ride messaging channels. | `_id`, `rideId`, `participants` (`[userId]`) |
| `MessageModel.ts` | `messages` | Chat message text content and sender identity. | `_id`, `chatRoomId`, `senderId` |
| `MessageStatusModel.ts` | `messagestatuses` | Per-user message delivery and read status. | `_id`, `messageId`, `userId` |
| `UserChatMode.ts` | `userchats` | Recent conversation list metadata. *(Note: filename lacks 'l')*. | `_id`, `userId`, `chatRoomId` |
| `NotificationModel.ts` | `notifications` | In-app user notifications and read flags. | `_id`, `recipientId`, `type`, `channel` |
| `KYCModel.ts` | `kycs` | Driver verification document links and audit logs. | `_id`, `driverId`, `documentType` |
| `RefreshTokenModel.ts` | `refreshtokens` | Hashed JWT refresh tokens with revocation flags. | `_id`, `userId`, `token` |
| `FareConfigurationModel.ts` | `fareconfigurations` | Active base rates, tiered rules, platform commissions, and GST taxes. | `_id`, `effectiveFrom`, `isActive` |

### 1.3 Indexes & Query Patterns
* **Geospatial 2dsphere Indexes**:
  - `driverAvailabilitySchema.index({ locationPoint: "2dsphere" })`: Powers `$geoNear` aggregation queries finding active nearby drivers for instant rides.
  - `driverAvailabilitySchema.index({ baseLocationPoint: "2dsphere" })`: Powers `$geoNear` aggregation matching driver base locations for scheduled rides.
* **Compound Unique Indexes**:
  - `driverAvailabilitySchema.index({ driverId: 1, isActive: 1 }, { unique: true, partialFilterExpression: { isActive: true } })`: Guarantees a driver has at most one active availability schedule.
  - `rideRequestSchema.index({ requestGroupId: 1, driverId: 1 }, { unique: true })`: Prevents sending duplicate requests to the same driver in a single dispatch group.
  - `ratingSchema.index({ rideId: 1, reviewerId: 1 }, { unique: true })`: Prevents duplicate ratings for a single ride.
  - `messageStatusSchema.index({ messageId: 1, userId: 1 }, { unique: true })`: Prevents duplicate status records.
* **TTL Auto-Purge Indexes**:
  - `rideRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })`: MongoDB background thread automatically purges expired requests.

### 1.4 Transactions Caveat
* `MongoUnitOfWork` (`src/infrastructure/database/repositories/MongoUnitOfWork.ts`) initializes and commits a Mongoose transaction session:
  ```typescript
  const session = await connection.startSession();
  session.startTransaction();
  const result = await work(); // session is NOT passed
  await session.commitTransaction();
  ```
* Because `session` is not passed into `work()` or bound to Mongoose queries via options or `AsyncLocalStorage`, **database queries currently execute non-atomically outside the transaction**.

---

## 2. Cache, Locks & Distributed Coordination (Redis)

### 2.1 Dual-Client Architecture
The repository intentionally utilizes two separate Redis client packages:
1. **`redis` (node-redis `^5.10.0`)**: Used by `RedisService` for key-value caching, distributed locking, and inter-process Pub/Sub.
2. **`ioredis` (`^5.10.1`)**: Used exclusively by BullMQ in `BullMQConnection.ts`.

### 2.2 Location Caching
* **Key Pattern**: `driver:location:{driverUserId}`
* **Payload**: JSON string containing `{ lat, lng, bearing, speedKph, accuracy, updatedAt }`.
* **TTL**: 300 seconds (5 minutes). Overwritten continuously by GPS streams. Auto-expires if driver drops offline.

### 2.3 Distributed Locking (`RedisLockService`)
* **Tokens**: Defined in `src/shared/constants/RedisLockKeys.ts`:
  - `ride_accept_lock:{requestId}` (TTL: 10s): Guards instant ride acceptance.
  - `future_ride_accept_lock:{requestId}` (TTL: 10s): Guards scheduled ride acceptance.
  - `ride:group:dispatch:{requestGroupId}` (TTL: 10s): Prevents race conditions when advancing sequential candidate dispatch.
  - `ride:group:timeout:{requestGroupId}` (TTL: 10s): Prevents collision during candidate timeout processing.
* **Mechanism**:
  - **Acquire**: `client.set(key, token, { NX: true, EX: ttlSeconds })` where `token = randomUUID()`. Returns token on success, `null` on failure.
  - **Release**: Atomic Lua script matching the token before deletion:
    ```lua
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
    ```

---

## 3. Queues & Background Workers (BullMQ)

### 3.1 Topology & Queues

```
[ producers: RideSearchQueueProducer, ChatRoomExpiryQueue, FutureRideExpiryQueue ]
                                      │
                                      ▼
                        [ Redis (ioredis Connection) ]
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          ▼                           ▼                           ▼
[ queue: ride-search ]     [ queue: future-ride-expiry ] [ queue: chat-room-expiry ]
          │                           │                           │
          ▼                           ▼                           ▼
[ worker.ts:                 [ app.ts:                   [ app.ts:
  RideRequestTimeoutWorker ]   FutureRideExpiryWorker ]    ChatRoomExpiryWorker ]
```

### 3.2 Queue Details & Concurrency

| Queue Name | Jobs Handled | Delay / Trigger | Concurrency | Host Process |
|---|---|---|---|---|
| `ride-search` | `REQUEST_TIMEOUT` | 45,000 ms per candidate | 10 | `worker.ts` |
| `ride-search` | `GROUP_NOTIFY_NO_DRIVER` | 180,000 ms (guard) | 10 | `worker.ts` |
| `ride-search` | `GROUP_HARD_EXPIRE` | 240,000 ms (guard) | 10 | `worker.ts` |
| `future-ride-expiry` | `FUTURE_RIDE_EXPIRY_JOB` | Scheduled before pickup window | 5 | `src/app.ts` |
| `chat-room-expiry` | `CHAT_ROOM_EXPIRY_JOB` | Scheduled with delay post-ride | 5 | `src/app.ts` |

### 3.3 Connection & Failure Configuration
* **Client**: Configured in `src/infrastructure/queues/BullMQConnection.ts` using `ioredis`.
* **Settings**: `maxRetriesPerRequest: null`, `enableReadyCheck: false`.
* **Retry Strategy**: Exponential delay capped at 2,000 ms: `Math.min(times * 100, 2000)`.
* **Job Retention**: `removeOnComplete: true`, `removeOnFail: 100`.

---

## 4. Realtime Architecture (Socket.IO & Redis Pub/Sub)

### 4.1 Connection Lifecycle & Handshake Authentication
* Handshake requests must provide a Bearer JWT access token via `auth.token` or `headers.authorization`.
* `SocketAuthMiddleware` decodes the token, attaches `{ userId, role, accessToken }` to `socket.data`, or rejects with an `Authentication error`.

### 4.2 Room Subscriptions

| Room Pattern | Enrolled Actors | Events Broadcasted |
|---|---|---|
| `user:{userId}` | All authenticated users | In-app notifications, account updates. |
| `driver:{userId}` | Users with `role: DRIVER` | `driver:request:created`, `driver:request:expired`, payout alerts. |
| `rider:{userId}` | Users with `role: RIDER` | `ride:search:progress`, `ride:no:driver:found`, ride arrival/start/complete. |
| `ride:{rideId}` | Driver & Rider of active trip | `driver:location:updated` (live GPS tracking coordinates). |
| `chat:{chatRoomId}` | Driver & Rider of active trip | `chat:message:received`, `chat:messages:read`. |

### 4.3 Inter-Process Redis Pub/Sub Bridge (`WorkerSocketBridge`)
Because `RideRequestTimeoutWorker` runs in a separate process (`worker.ts`), it cannot access the Socket.IO `io` server instance directly. It communicates via Redis Pub/Sub channels:

| Redis Channel | Triggered By | Socket.IO Event Emitted | Target Room |
|---|---|---|---|
| `PUBSUB_CHANNELS.RIDE_SEARCH_PROGRESS` | Candidate driver cycling | `ride:search:progress` | `rider:{riderId}` |
| `PUBSUB_CHANNELS.RIDE_REQUEST_CREATED` | New candidate dispatch | `driver:request:created` | `driver:{driverUserId}` |
| `PUBSUB_CHANNELS.RIDE_REQUEST_EXPIRED` | Candidate 45s timeout | `driver:request:expired` | `driver:{driverUserId}` |
| `PUBSUB_CHANNELS.RIDE_NO_DRIVER_FOUND` | Candidates exhausted | `ride:no:driver:found` | `rider:{riderId}` |

---

## 5. External Services & Cloud APIs

### 5.1 Razorpay Payment Gateway
* **Client**: `RazorpayService.ts` wrapping `new Razorpay({ key_id, key_secret })`.
* **Order Creation**: `client.orders.create({ amount: amountInPaise, currency, receipt, notes })`. Amount is multiplied by 100 to convert decimal currency to integer paise.
* **Signature Verification**: Locally computes HMAC-SHA256 signature over `${gatewayOrderId}|${gatewayPaymentId}` using `RAZORPAY_KEY_SECRET`. Compares against `gatewaySignature`.
* **Retries & Timeouts**: Fails fast with logged error context; no automatic retries.

### 5.2 Resend Transactional Email Gateway
* **Client**: `EmailService.ts` wrapping `new Resend(apiKey)`.
* **Sending**: `resend.emails.send({ from, to, subject, html })`.
* **Templates**: Generates responsive HTML verification emails with formatted 4-digit OTP codes.

### 5.3 Google OAuth2 Client
* **Client**: `GoogleAuthService.ts` wrapping `new google.auth.OAuth2(clientId, clientSecret, callbackUrl)`.
* **Authorization URL**: Requests scopes `userinfo.email` and `userinfo.profile` with `access_type: "offline"` and `prompt: "consent"`.
* **Token Exchange**: Calls `oauth2Client.getToken(code)` and fetches profile information via `google.oauth2("v2").userinfo.get()`.

---

## 6. File & Media Storage (Cloudinary)

* **Upload Pipeline**:
  ```
  Express HTTP Multipart Request
               │
               ▼
  [ MulterMiddleware ] ──► Stores file buffer in RAM (multer.memoryStorage)
               │
               ▼
  [ CloudinaryService.upload ]
    ├─ Converts buffer to stream via streamifier.createReadStream(fileBuffer)
    ├─ Uploads to folder: steerigo/${purpose}
    ├─ Generates public_id: ${userId}_${timestamp}_${sanitizedFilename}
    ├─ Applies auto-transformations: { quality: "auto:good", fetch_format: "auto" }
    └─ Returns secure_url and public_id
               │
               ▼
  [ Persistence ] ──► Saved in KYCModel (license/id) or UserModel (profile picture)
  ```
* **Deletion**: Invokes `cloudinary.uploader.destroy(publicId)`.

---

## 7. Deployment & Runtime Architecture

### 7.1 Process Model
Production requires running **two distinct Node.js processes**:
1. **API & Realtime Server**: `node dist/app.js` (listens on `PORT`, serves REST routes and WebSockets).
2. **Background Dispatch Worker**: `node dist/worker.js` (processes BullMQ timeouts and dispatch queues).

### 7.2 Build Pipeline
* **Command**: `npm run build` (`tsc && tsc-alias`).
* Compiles TypeScript into JavaScript in `dist/`, and resolves all path aliases (`@domain/*`, etc.) to relative filesystem paths.

### 7.3 Multi-Instance Scaling Constraints
* Socket.IO currently operates with the default in-memory adapter.
* Running multiple API server instances behind a load balancer will result in lost WebSocket events between servers. Enabling horizontal scaling requires configuring `@socket.io/redis-adapter`.
* The hardcoded `{ dbName: "steerigo" }` in `DatabaseConnection` must be accounted for when staging or testing against non-production databases.
