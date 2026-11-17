# Steerigo Backend — Developer & AI Agent Guidelines

## 1. Project Overview
Steerigo is an on-demand driver and ride-hailing platform backend built with Node.js, Express, TypeScript, MongoDB (Mongoose), Redis, and Socket.IO.
- **Riders**: Search nearby drivers, book instant or scheduled rides, apply coupons, track drivers in real time, chat in-ride, pay (Razorpay or cash), and rate drivers.
- **Drivers**: Onboard with KYC documents, configure weekly recurring availability and calendar exceptions, receive sequential ride dispatches, navigate ride state transitions with verification codes, maintain digital wallets, and request payouts.
- **Admins**: Audit users, verify/reject driver KYC submissions, manage coupons, review platform ledgers, and approve/reject driver payout requests.

---

## 2. Architecture Boundaries

The codebase follows Clean Architecture / DDD conventions organized under path aliases:

```
@interface/*      ──► @application/*    ──► @domain/*
(@interface)          (@application)        (@domain)
Controllers, Routes,  Use Cases, DTOs,      Entities, Value Objects,
Middleware, Zod       App Services, Events  Repo Interfaces, Domain Errors
      ▲                     ▲                     ▲
      │                     │                     │
      └─────────────────────┴─────────────────────┘
                            ▲
                  @infrastructure/*
                  (@infrastructure)
                  Mongoose Repos, Models, BullMQ Workers,
                  Redis, Socket.IO, DI Container, Cloud SDKs
```

* **`@domain/*` (`src/domain/`)**: Pure enterprise business logic. Entities, value objects, domain error classes, and repository interface definitions. **Must not depend on any outer layer** (no Mongoose, Express, or framework code).
* **`@application/*` (`src/application/`)**: Application workflows. Implements `IUseCase`, coordinates domain entities and repository interfaces, defines DTOs, service interfaces, and in-memory domain events.
* **`@infrastructure/*` (`src/infrastructure/`)**: Framework and driver implementations. Mongoose models/schemas, concrete repositories, BullMQ queues/workers, Redis caching/locking, Socket.IO handlers, third-party adapters (Razorpay, Cloudinary, Resend, Google OAuth), and the Inversify DI composition root.
* **`@interface/*` (`src/interface/`)**: HTTP transport and presentation. Express routes, controllers, middleware, and Zod validation schemas.
* **`@shared/*` (`src/shared/`)**: Cross-cutting utilities, Winston logging, error response builders, HTTP/error enums, DI tokens (`TYPES`), and the monadic `Result<T>` wrapper.

---

## 3. Coding Conventions

### 3.1 Use Cases & Result Pattern
- All use cases implement `IUseCase<InputDto, Promise<Result<OutputDto>>>`.
- **Never throw unhandled exceptions across layer boundaries.** Always return `Result.success(data)` or `Result.failure(error)`.
- Use cases must never return raw Mongoose documents or domain entities directly to controllers; always map to a typed Response DTO.

### 3.2 Domain Entities & Value Objects
- Entity constructors are `private`. Always instantiate via static factory methods:
  - `Entity.create(...)`: For brand-new entities (validates initial invariants and applies business defaults).
  - `Entity.fromData(...)` / `Entity.reconstruct(...)`: For reconstituting persistence data into entities.
- Value objects (`Location`, `Money`, `FareBreakdown`, `RideTimeline`) are immutable and validate their own invariants on creation.

### 3.3 Dependency Injection (InversifyJS)
- Every injectable class must be decorated with `@injectable()`.
- Dependencies must be injected via `@inject(TYPES.SymbolName)`.
- All injection tokens are registered in `src/shared/constants/DITypes.ts`.
- Service, repository, use case, and controller registrations live in modular factories under `src/infrastructure/container/factories/*.ts`.
- Default binding scope is **Transient** (new instance per resolution). Singletons must explicitly specify `.inSingletonScope()`.

### 3.4 Controllers & Routing
- Keep controllers thin. They should only:
  1. Extract request params/body into a strongly typed DTO (`Dto.fromRequest(...)`).
  2. Invoke `await this.useCase.execute(dto)`.
  3. Format the HTTP response via `res.status(...).json(apiResponse)` on success, or delegate to `ErrorHandlerService.handleError(error)` on failure.
- Route files resolve controllers from the DI container at startup (`container.get<Controller>(TYPES.Controller)`).

### 3.5 Validation
- **Transport / Schema**: Every route must validate incoming payloads via `validateSchema(schema)` using Zod schemas from `@interface/validators/*`.
- **Semantic / Contextual**: DTOs validate operational semantics in `dto.validate()` (e.g. date cannot be in the past).
- **Business Invariants**: Enforced inside domain entities and value objects.

### 3.6 Imports & Paths
- Always use configured path aliases (`@domain/*`, `@application/*`, `@infrastructure/*`, `@interface/*`, `@shared/*`).
- **Never use relative deep traversals** (e.g. `../../../../domain/...`).

---

## 4. Persistent Project Rules

1. **Preserve Dual Runtime Topography**:
   - The application requires **two distinct processes**:
     1. Web & Socket Server (`src/app.ts`).
     2. Standalone Queue Worker (`src/worker.ts` running BullMQ `RideRequestTimeoutWorker`).
   - Core ride dispatch timeouts and candidate cycling **will not run** if `src/worker.ts` is omitted.
2. **Respect the Driver Dual-Identity Concept**:
   - Drivers have two IDs:
     - `driverId`: The `_id` of the `Driver` entity (`DriverModel`).
     - `driverUserId`: The `_id` of the linked `User` entity (`UserModel`).
   - **Crucial**: Sockets, notifications, and auth listen on `driver:${driverUserId}` (or `user:${userId}`). Rides, availability records, and financial ledgers reference `driverId`. Always map `driverId` to `driver.getUserId()` before emitting events or pushing notifications.
3. **Guard Concurrent Ride State Mutations with Redis Locks**:
   - Always acquire the corresponding lock from `REDIS_LOCK_KEYS` (`RedisLockService`) before accepting, rejecting, or advancing sequential dispatch on a ride or ride group.
4. **Never Bypass Repositories**:
   - Never import Mongoose models directly into Use Cases or Controllers. All database operations must go through domain repository interfaces.
5. **Preserve API Response Contracts**:
   - Standard successful responses: `{ success: true, message: string, data?: T }`.
   - Standard error responses: `{ success: false, message: string, errors?: Array<{ field: string, message: string }> }`.

---

## 5. Important Constraints

* **Stateful Auth Check**: `authMiddleware` validates JWT access tokens AND verifies `userRepository.findById(payload.userId)` + `user.canLogin()` on every authenticated request. Banned or unverified users are rejected immediately.
* **Database Transactions Caveat**: `MongoUnitOfWork` starts and commits a Mongoose transaction session, but currently **does not pass `session` to repository methods**. Operations inside `runInTransaction` execute non-atomically. Keep multi-step operations defensive.
* **Hardcoded Database Name**: `DatabaseConnection` enforces `{ dbName: "steerigo" }`. Query parameters specifying a database name in `MONGO_URI` are overridden.
* **Dynamic Ride Fare Recalculation**: On ride completion (`MarkRideAsCompletedUseCase`), duration is calculated as $\max(\text{bookedDuration}, \text{actualDuration})$. Fares and applied coupon discounts are re-evaluated against the final duration.
* **Dual Redis Libraries**:
  - `ioredis` is used exclusively for BullMQ (`BullMQConnection.ts`).
  - `redis` (node-redis) is used for cache, distributed locks, and Pub/Sub (`RedisService.ts`).
* **Socket.IO Scaling**: Socket.IO currently uses the in-memory adapter. Running multiple backend instances behind a load balancer requires configuring `@socket.io/redis-adapter`.

---

## 6. High-Risk Areas & Known Code Quirks

| Area | Why It Is Sensitive | What to Verify Before Changing |
|---|---|---|
| **Sequential Ride Dispatch** | Involves Redis locks, BullMQ delayed jobs (`REQUEST_TIMEOUT`), and Redis Pub/Sub bridged to Socket.IO. Race conditions between driver rejections and queue timeouts can stall candidate cycling. | Check `RideSearchDispatchService`, `RideRequestTimeoutWorker`, and lock acquisition logic. |
| **Earnings & Ledger Settlement** | `EarningsDistributionService` executes multiple sequential ledger writes (platform fee, GST, driver wallet, coupon compensation). If a step fails, prior writes are not rolled back. | Check wallet balances, transaction record types, and cash vs. online distribution paths. |
| **`UserChatMode.ts` Model** | The Mongoose model file is named `UserChatMode.ts` (missing the 'l') in `src/infrastructure/database/models/UserChatMode.ts`. | Do not rename without updating all imports in `UserChatMapper.ts` and `UserChatRepositoryImpl.ts`. |
| **`IFareCalculationService1.ts` Binding** | `FareConfigurationFactory.ts` actively binds `TYPES.FareCalculationService` to the class in `src/application/services/IFareCalculationService1.ts`. `src/infrastructure/services/FareCalculationService.ts` is an unreferenced duplicate. | Make fare logic changes in `IFareCalculationService1.ts` (or explicitly update the DI binding). |
| **Client Build Static Path** | In `src/app.ts`, production static serving looks for `../client/build`, whereas the repository frontend directory is named `frontend/`. | Verify static asset serving configuration before deploying full-stack bundles. |

---

## 7. Development Commands

### 7.1 Running Locally
```bash
# Terminal 1: Run HTTP API & Socket.IO Server (Hot reload)
npm run dev

# Terminal 2: Run Background Queue Worker (Hot reload)
npm run dev:worker
```

### 7.2 Building & Type Checking
```bash
# Build TypeScript and rewrite path aliases into dist/
npm run build

# Run TypeScript compilation check without emitting files
npx tsc --noEmit
```

### 7.3 Code Quality & Linting
```bash
# Run ESLint check
npm run lint

# Automatically fix ESLint errors
npm run lint:fix
```

### 7.4 Running in Production
```bash
# Start API & Socket server
npm run start

# Start standalone background queue worker
npm run worker
```

*(Note: There is currently no configured test suite. `npm test` outputs `"Error: no test specified"`).*

---

## 8. Change Workflow

When implementing features or bug fixes in this repository, follow this sequence:

1. **Locate Layer Responsibilities**:
   - Business rules $\rightarrow$ Domain Entity / Value Object.
   - Orchestration / Logic $\rightarrow$ Application Use Case (`IUseCase`).
   - Database / External API $\rightarrow$ Infrastructure Repository / Service.
   - HTTP route / validation $\rightarrow$ Interface Controller / Zod Validator.
2. **Register in DI Container**:
   - Add symbol to `src/shared/constants/DITypes.ts`.
   - Add `@injectable()` and inject via `@inject(TYPES.X)`.
   - Bind in the appropriate factory (`src/infrastructure/container/factories/*.ts`).
3. **Trace Dual Identities & Concurrency**:
   - Verify whether IDs are `driverId` (Driver entity) or `userId` / `driverUserId` (User entity).
   - Ensure state-mutating ride operations are protected by Redis locks.
4. **Verify Build & Types**:
   - Run `npm run lint` and `npm run build` to confirm `tsc-alias` compiles cleanly.

---

## 9. Documentation References

For detailed architectural flow diagrams and specifications, refer to:
- `docs/architecture/system-overview.md`
- `docs/architecture/core-flows.md`
- `docs/architecture/infrastructure.md`
