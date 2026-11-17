# Steerigo Backend — System Overview

---

## 1. System Purpose & Actors

Steerigo Backend is an on-demand driver and ride-hailing service platform built with Node.js, Express, TypeScript, MongoDB, Redis, and Socket.IO. The platform coordinates vehicle owners (riders) who require drivers, professional drivers seeking driving assignments, and platform administrators who oversee operations and finances.

### 1.1 Major Actors & Capabilities
* **Rider (`RIDER`)**:
  - Registers and authenticates via email OTP or Google OAuth2.
  - Discovers nearby available drivers using real-time geospatial search.
  - Books instant rides (sequential dispatch) or schedules advance bookings (broadcast dispatch).
  - Applies promotional coupons to rides.
  - Verifies driver pickup using a secure 4-digit ride OTP.
  - Tracks driver arrival and trip progress in real-time on live maps.
  - Communicates with the assigned driver via an in-ride chat room.
  - Settles fares via Razorpay online payment or cash-on-delivery.
  - Submits ratings and reviews for drivers.
* **Driver (`DRIVER`)**:
  - Registers, submits KYC identity proofs and driving licenses, and tracks verification status.
  - Configures weekly recurring availability schedules and date-specific calendar exceptions.
  - Streams real-time GPS coordinates via WebSockets.
  - Receives sequential instant ride requests with a 45-second acceptance window.
  - Receives broadcast future ride requests matching their designated base location.
  - Executes rides through a strict status lifecycle: `ACCEPTED` $\rightarrow$ `ARRIVED` $\rightarrow$ `STARTED` (with OTP) $\rightarrow$ `COMPLETED`.
  - Maintains an audited digital wallet tracking net earnings, cash commission deductions, and coupon compensations.
  - Requests withdrawal payouts to their bank account.
* **Admin (`ADMIN`)**:
  - Audits registered users and drivers.
  - Inspects driver KYC submissions, approves credentials, or rejects with feedback.
  - Manages promotional discount coupons (percentage or fixed discounts, usage caps, validity windows).
  - Inspects platform-wide transaction ledgers and financial balances.
  - Approves or rejects driver withdrawal payout requests.

---

## 2. Technology Stack

* **Language**: TypeScript (`^5.9.2`) targeting `ES2020` with CommonJS modules, experimental decorators, and path aliases.
* **Runtime**: Node.js (`>=20`).
* **Web Framework**: Express (`^4.18.2`) with CookieParser, Helmet, CORS, and JSON body parser.
* **Dependency Injection**: InversifyJS (`^6.0.1`) with `reflect-metadata`.
* **Primary Database**: MongoDB accessed via Mongoose (`^8.0.0`) utilizing 2dsphere geospatial indexes and TTL indexes.
* **Cache, Locks & Pub/Sub**: Redis accessed via two clients:
  - `redis` (`^5.10.0`): Driver location caching, distributed locks, and inter-process Pub/Sub.
  - `ioredis` (`^5.10.1`): BullMQ queue connections.
* **Job Queues & Workers**: BullMQ (`^5.73.0`) for delayed timeout processing, search expiration guards, and chat room termination.
* **Realtime Engine**: Socket.IO (`^4.8.3`) for bidirectional client events, GPS streaming, and in-ride chat.
* **Input Validation**: Zod (`^4.1.11`) for declarative schema validation on HTTP routes.
* **Payment Gateway**: Razorpay Node.js SDK (`^2.9.6`) with HMAC-SHA256 signature verification.
* **Media Storage**: Cloudinary SDK (`^2.7.0`) via Multer (`^2.0.2`) memory storage and `streamifier`.
* **Transactional Email**: Resend SDK (`^6.12.4`) for HTML OTP delivery.
* **Authentication & Cryptography**: `jsonwebtoken` (`^9.0.2`), `bcrypt` (`^6.0.0`), `googleapis` (`^118.0.0`).
* **Logging**: Winston (`^3.19.0`) and `winston-daily-rotate-file` with daily rotating log files under `logs/`.
* **Build Tooling**: `tsc` (TypeScript compiler) and `tsc-alias` (replaces path aliases with relative paths).

---

## 3. System Architecture

The repository enforces a Domain-Driven Design (DDD) layered architecture decoupled via Inversion of Control:

```
[ Client Applications ]
(Rider Web/Mobile, Driver Mobile, Admin Dashboard)
          │
          ├───────────────────────────────────────────────────────┐
          │ HTTP / REST API                                       │ WebSockets (Socket.IO)
          ▼                                                       ▼
┌────────────────────────────────────────────────────────┐ ┌──────────────────────────────────────────┐
│                   Interface Layer                      │ │           Socket.IO Server               │
│ - Security Middleware (Helmet, CORS, CookieParser)     │ │ - SocketAuthMiddleware (JWT verification)│
│ - Zod Request Validation Middleware (validateSchema)   │ │ - Room Management (user, driver, rider)  │
│ - Auth Middleware (JWT + DB user.canLogin() check)     │ │ - Event Handlers (RideRoom, ChatRoom,    │
│ - Express Controllers (DTO Extraction & Formatting)    │ │   DriverLocation)                        │
└──────────────────────────┬─────────────────────────────┘ └────────────────────▲─────────────────────┘
                           │                                                    │
                           ▼                                                    │
┌────────────────────────────────────────────────────────┐                      │
│                  Application Layer                     │                      │
│ - Use Cases (implementing IUseCase<Input, Result<Out>>)│                      │
│ - Application DTOs (Request / Response Factories)      │                      │
│ - Domain Event Contracts & In-Memory EventBus          │                      │
│ - Orchestration Services (RideSearchDispatchService)   │                      │
└──────────────────────────┬─────────────────────────────┘                      │
                           │                                                    │
           ┌───────────────┴───────────────┐                                    │
           ▼                               ▼                                    │
┌────────────────────────┐   ┌───────────────────────────┐                      │
│      Domain Layer      │   │   Infrastructure Layer    │                      │
│ - Rich Entities        │   │ - Mongoose Repositories   │                      │
│ - Value Objects        │   │ - Persistence Mappers     │                      │
│ - Repository Contracts │   │ - Redis Locking & Cache   │                      │
│ - Domain Errors        │   │ - BullMQ Queue Producers  │                      │
└────────────────────────┘   │ - External Cloud Adapters │                      │
                             └─────────────┬─────────────┘                      │
                                           │                                    │
                  ┌────────────────────────┴────────────────────────┐           │
                  ▼                                                 ▼           │
     ┌────────────────────────┐                        ┌──────────────────────┐ │
     │    MongoDB Database    │                        │     Redis Store      │ │
     │ - Collections          │                        │ - Location Snapshots │ │
     │ - 2dsphere Geo Indexes │                        │ - Distributed Locks  │ │
     │ - Double-Entry Ledgers │                        │ - BullMQ Queues      │ │
     └────────────────────────┘                        │ - Pub/Sub Hub        │ │
                                                       └──────────┬───────────┘ │
                                                                  │             │
                                  ┌───────────────────────────────┘             │
                                  │ Inter-Process Redis Pub/Sub                 │
                                  ▼                                             │
               ┌─────────────────────────────────────┐                          │
               │         Background Workers          │                          │
               │ - RideRequestTimeoutWorker (worker) ├──────────────────────────┘
               │ - FutureRideExpiryWorker (app)      │ (Relayed via WorkerSocketBridge)
               │ - ChatRoomExpiryWorker (app)        │
               └─────────────────────────────────────┘
```

---

## 4. Major Modules & Responsibilities

The codebase is partitioned into five distinct layers defined by path aliases in `tsconfig.json`:

### 4.1 `@domain/*` (`src/domain/`)
- **Responsibility**: Pure business logic, core enterprise invariants, state machines, and interface contracts.
- **Dependencies**: Completely self-contained. Has zero imports from application, infrastructure, or interface layers.
- **Key Subdirectories**:
  - `entities/`: Rich business models (`Ride`, `Driver`, `User`, `Wallet`, `Payment`, `Transaction`, `Coupon`, `ChatRoom`, `Message`).
  - `value-objects/`: Immutable value representations (`Location`, `Money`, `FareBreakdown`, `RideTimeline`, `RideStatus`, `PaymentStatus`).
  - `repositories/`: Persistence abstraction contracts (`IRideRepository`, `IDriverRepository`, `IWalletRepository`, `IUnitOfWork`).
  - `errors/`: Domain-specific error types subclassing `DomainError`.

### 4.2 `@application/*` (`src/application/`)
- **Responsibility**: Application use case orchestration, DTO transformations, domain event publishing, and cross-cutting service contracts.
- **Dependencies**: Depends on `@domain/*` and `@shared/*`.
- **Key Subdirectories**:
  - `use-cases/`: Single-responsibility command/query classes (`AcceptRideRequestUseCase`, `VerifyPaymentUseCase`, `FindNearbyDriversUseCase`, `CancelRideUseCase`) implementing `IUseCase`.
  - `dto/`: Strongly typed input/output representations with factory methods (`fromRequest`).
  - `services/`: Interfaces and domain coordination services (`IRideSearchDispatchService`, `IEarningsDistributionService`, `IFareCalculationService`).
  - `events/`: Event definitions (`RideRequestCreatedEvent`, `PaymentSucceededEvent`) and handler contracts (`IEventHandler`).

### 4.3 `@infrastructure/*` (`src/infrastructure/`)
- **Responsibility**: Concrete implementations of persistence, caching, queues, sockets, external APIs, and dependency injection.
- **Dependencies**: Implements interfaces from `@domain/*` and `@application/*`.
- **Key Subdirectories**:
  - `container/`: Central Inversify DI container (`DIContainer.ts`) and modular binding factories (`factories/*.ts`).
  - `database/`: Mongoose schemas/models (`models/`), entity mappers (`mappers/`), and repository implementations (`repositories/`).
  - `queues/`: BullMQ queue declarations (`RideSearchQueue`, `FutureRideExpiryQueue`, `ChatRoomExpiryQueue`).
  - `workers/`: Background job consumers (`RideRequestTimeoutWorker`, `FutureRideExpiryWorker`, `ChatRoomExpiryWorker`).
  - `realtime/`: Socket.IO room lifecycle, authentication, event handlers, and the Redis-to-Socket.IO bridge (`WorkerSocketBridge`).
  - `services/`: Concrete cloud integrations (`RazorpayService`, `CloudinaryService`, `EmailService`, `RedisLockService`).

### 4.4 `@interface/*` (`src/interface/`)
- **Responsibility**: HTTP and WebSocket communication, request parsing, authentication verification, and response serialization.
- **Dependencies**: Depends on `@application/*` (use cases, DTOs), `@infrastructure/container` (for controller resolution), and `@shared/*`.
- **Key Subdirectories**:
  - `controllers/`: Thin HTTP handlers extracting DTOs and invoking use cases.
  - `routes/`: Express router trees mounted under `/api` (`/auth`, `/driver`, `/user`, `/admin`, `/payment`, `/chat-room`, `/notifications`, `/file`).
  - `middleware/`: Cross-cutting filters (`authMiddleware`, `requireRole`, `validateSchema`, `RateLimiter`, `ErrorHandlerMiddleware`).
  - `validators/`: Declarative Zod schemas for request validation.

### 4.5 `@shared/*` (`src/shared/`)
- **Responsibility**: Common utilities, logging, HTTP status enums, centralized error classification, and DI symbol constants.
- **Dependencies**: External utilities (Winston, nanoid, uuid). No dependencies on outer application layers.
- **Key Subdirectories**:
  - `constants/`: Global constants, messages, and Inversify injection tokens (`TYPES` in `DITypes.ts`).
  - `errors/`: Prioritized error classification pipeline (`ErrorClassificationService`).
  - `utils/`: Monadic `Result<T>` wrapper, Winston `Logger`, `idHelper`.

---

## 5. Application Entry Points

### 5.1 Web API & Socket Server (`src/app.ts`)
- **Startup Sequence**:
  1. Loads environment variables via `dotenv.config()`.
  2. Binds Express security middleware (Helmet, CORS, CookieParser, 10MB JSON body parser, Winston request logger).
  3. Mounts REST routes under `/api`.
  4. Connects to MongoDB via `DatabaseConnection.getInstance().connect()`.
  5. Initializes Socket.IO on the underlying HTTP server with JWT handshake authentication.
  6. Starts in-process background workers (`FutureRideExpiryWorker`, `ChatRoomExpiryWorker`).
  7. Starts `WorkerSocketBridge`, subscribing to Redis Pub/Sub channels to forward worker events to Socket.IO rooms.
  8. Registers notification realtime publisher in the DI container.
  9. Starts HTTP listener on `PORT` (defaults to 3000).
  10. Registers graceful shutdown handlers for `SIGTERM` and `SIGINT`.

### 5.2 Standalone Queue Worker (`src/worker.ts`)
- **Startup Sequence**:
  1. Loads environment variables.
  2. Connects to MongoDB via `DatabaseConnection`.
  3. Resolves `RideRequestTimeoutWorker` from the Inversify container.
  4. Starts the BullMQ worker listening to the `ride-search` queue (concurrency: 10).
  5. Handles candidate timeouts and sequential driver escalation.
  6. Registers graceful shutdown handlers.

### 5.3 Realtime Socket Handshake (`src/infrastructure/realtime/socket.ts`)
- Mounted on the Express HTTP server instance.
- Verified via `SocketAuthMiddleware` using Bearer JWT access tokens.
- Clients are enrolled into standardized rooms: `user:${userId}`, `driver:${userId}`, `rider:${userId}`, `ride:${rideId}`, and `chat:${chatRoomId}`.

---

## 6. Data Stores & Persistence

* **MongoDB (Mongoose `^8.0.0`)**: Primary document database. Stores users, drivers, availabilities (2dsphere geospatial coordinates), rides, transient dispatch groups, double-entry wallets, transaction ledgers, chat messages, and KYC documents.
* **Redis (`redis` and `ioredis`)**:
  - **Driver Location Cache**: Real-time driver coordinates stored under `driver:location:{driverUserId}` with 300-second (5m) TTL.
  - **Distributed Locks**: Atomic mutual exclusion via `SET NX EX` (TTL: 10s) using tokens released via Lua scripts.
  - **Queue Engine**: Persistence and timer backend for BullMQ.
  - **Inter-Process Pub/Sub**: Bridges asynchronous events from `worker.ts` to `app.ts` (`PUBSUB_CHANNELS`).
* **Cloudinary**: Cloud object storage for driver license images, identity documents, and user profile avatars.

---

## 7. External Integrations

* **Razorpay (`RazorpayService.ts`)**: Creates order IDs in paise (`amount * 100`) and validates HMAC-SHA256 signatures for online payments.
* **Resend (`EmailService.ts`)**: Delivers transactional HTML emails for signup OTPs and password reset verification codes.
* **Google OAuth2 (`GoogleAuthService.ts`)**: Generates consent URLs and exchanges authorization codes for user profile details and tokens.
* **Cloudinary (`CloudinaryService.ts`)**: Encapsulates remote multipart file streaming, image transformations, and secure deletions.

---

## 8. Configuration Architecture

Configuration is loaded from a root `.env` file via `dotenv`. Keys are grouped functionally:
- **Server**: `PORT`, `NODE_ENV`, `CLIENT_URL`, `FRONTEND_URL`, `CORS_ORIGINS`.
- **Database**: `MONGO_URI`.
- **In-Memory & Queues**: `REDIS_URL`.
- **Security & Tokens**: `JWT_SECRET`, `JWT_EXPIRES_IN`, `REFRESH_TOKEN_SECRET`, `REFRESH_TOKEN_EXPIRES_DAYS`, `BCRYPT_ROUNDS`, `OTP_LENGTH`, `OTP_TTL_SECONDS`, `MAX_OTP_ATTEMPTS`.
- **Cloud Providers**: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`.
- **Rate Limits & Concurrency**: `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS`, `RIDE_ACCEPT_LOCK_TTL_SECONDS`.
- **Financial**: `ADMIN_WALLET_OWNER_ID`.

---

## 9. Runtime Overview (Dual-Process Operation)

The backend requires **two separate processes** running concurrently:
1. **Web API & Sockets**:
   - Development: `npm run dev` (`nodemon --exec ts-node -r tsconfig-paths/register src/app.ts`).
   - Production: `npm run start` (`node dist/app.js`).
2. **Background Dispatch Worker**:
   - Development: `npm run dev:worker` (`ts-node-dev -r tsconfig-paths/register --respawn --transpile-only src/worker.ts`).
   - Production: `npm run worker` (`node dist/worker.js`).

**Critical Runtime Note**: If `worker.ts` is not running, BullMQ delayed timeout jobs will never be processed, causing candidate driver cycling during instant ride searches to stall permanently.

---

## 10. Architectural Principles

1. **Strict Dependency Inversion**: Application use cases depend only on repository interfaces; infrastructure provides the concrete implementations.
2. **Monadic Outcome Encapsulation**: Use cases return `Result.success(data)` or `Result.failure(error)` rather than throwing unhandled exceptions.
3. **Encapsulated Entity Invariants**: Domain entities enforce private constructors and invariant validation inside static factories.
4. **Stateful Per-Request Authentication**: `authMiddleware` validates JWT tokens and queries MongoDB (`findById`) on every request to ensure suspended or unverified users are immediately denied access.
5. **Three-Stage Validation**:
   - Syntactic (Zod schema in route middleware).
   - Semantic (DTO `validate()` in use cases).
   - Business Invariant (Entity/Value Object constructors).
