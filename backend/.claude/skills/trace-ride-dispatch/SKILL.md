---
name: trace-ride-dispatch
description: Diagnostic and implementation procedure for investigating, debugging, or modifying the instant ride search and sequential candidate driver dispatch pipeline across BullMQ, Redis distributed locks, Redis Pub/Sub, and Socket.IO.
---

# Trace Ride Dispatch

## Purpose
Provides a systematic diagnostic procedure to trace ride search failures, candidate driver timeouts, and event delivery across the dual-process architecture (`app.ts` and `worker.ts`).

## When to Use
- Ride search stalls on the first candidate driver and does not advance.
- Candidate drivers do not receive `driver:request:created` socket alerts.
- Riders do not receive search progress or "no driver found" updates.
- Modifying timeout durations, candidate selection criteria, or dispatch locks.

## Preconditions
1. Confirm both processes are running:
   - Terminal 1: `npm run dev` (`src/app.ts`)
   - Terminal 2: `npm run dev:worker` (`src/worker.ts`)
2. Verify Redis (`REDIS_URL`) and MongoDB (`MONGO_URI`) are accessible.

## Procedure

### Step 1: Trace the Geospatial Discovery Query
1. Inspect `AutoSearchAndSendRideRequestUseCase.ts` (`src/application/use-cases/user/`).
2. Verify that `driverAvailabilityRepository.findNearbyAvailableDrivers` executes the `$geoNear` aggregation pipeline in `DriverAvailabilityRepositoryImpl.ts`.
3. Check candidate criteria:
   - Driver must have `isActive: true` and `status: AVAILABLE`.
   - Driver vehicle must match requested `gearType` and `bodyType`.
   - Driver base or current coordinates must fall within `radiusKm`.

### Step 2: Inspect RideRequestGroup State
1. In MongoDB, query the active group:
   ```javascript
   db.riderequestgroups.findOne({ _id: "<requestGroupId>" })
   ```
2. Verify:
   - `status`: Must be `ACTIVE`. If `COMPLETED` or `EXHAUSTED`, the dispatch lifecycle has terminated.
   - `candidateDriverIds`: Array of sorted driver IDs.
   - `currentIndex`: Indicates which driver is currently being evaluated.

### Step 3: Inspect BullMQ Queue & Worker
1. The queue name is `ride-search` (`RIDE_SEARCH_QUEUE.NAME` in `src/shared/constants/RideSearchQueueConstants.ts`).
2. Verify that `RideSearchQueueProducer` scheduled `ride-request-timeout-<requestId>` with delay (default 45,000 ms).
3. Verify that `RideRequestTimeoutWorker` is running inside `src/worker.ts` (concurrency: 10).
4. If the worker is running, verify whether `handleRequestTimeout` acquired the lock:
   ```typescript
   const lockKey = `${REDIS_LOCK_KEYS.RIDE_REQUEST_GROUP_TIMEOUT}${requestGroupId}`;
   ```

### Step 4: Trace the Redis Pub/Sub Inter-Process Bridge
1. The worker process does NOT emit to Socket.IO directly. It publishes to Redis channels:
   - `PUBSUB_CHANNELS.RIDE_REQUEST_CREATED` (`ride:request:created`)
   - `PUBSUB_CHANNELS.RIDE_SEARCH_PROGRESS` (`ride:search:progress`)
   - `PUBSUB_CHANNELS.RIDE_NO_DRIVER_FOUND` (`ride:no:driver:found`)
   - `PUBSUB_CHANNELS.RIDE_REQUEST_EXPIRED` (`ride:request:expired`)
2. Verify that `WorkerSocketBridge.start()` was executed in `src/app.ts`.
3. Check `WorkerSocketBridge.ts` subscriber handlers:
   - Does it receive the Redis message?
   - Does it resolve `getRideSocketServer()`?

### Step 5: Verify Socket.IO Room Addressing
1. **Critical Dual-Identity Check**:
   - `WorkerSocketBridge` emits driver events to `io.to("driver:" + payload.driverUserId)`.
   - Sockets join room `driver:${socket.data.userId}` upon connection.
   - **Bug check**: If payload emitted `driverId` (Driver model `_id`) instead of `driverUserId` (User model `_id`), the socket will never receive the event.

## Repository-Specific Checks
- Check `src/shared/constants/RedisLockKeys.ts` for lock key prefixes.
- Check `src/shared/constants/PubSubChannels.ts` for channel strings.
- Check `src/shared/constants/SocketEvents.ts` for Socket event names.

## Safety Constraints
- Never remove Redis lock acquisition in `dispatchNextRequest` or `handleRequestTimeout`.
- Never call Socket.IO methods directly inside `src/infrastructure/workers/RideRequestTimeoutWorker.ts`. All worker-to-socket communication must pass through Redis Pub/Sub.

## Verification
1. Simulate a search request via `POST /api/user/ride/auto-search-request`.
2. Inspect logs in both terminals:
   - Terminal 1 (`app.ts`): Should log `Ride search group created`, `WorkerSocketBridge` subscriber event, and socket room emission.
   - Terminal 2 (`worker.ts`): Should log `Ride search worker job completed` after 45 seconds if unaccepted.
3. Check that `currentIndex` increments from 0 to 1 in MongoDB.

## Escalation
Stop and ask the user if:
- Redis connection strings differ between `src/app.ts` and `src/worker.ts` in the deployment environment.
- Candidate drivers are rejected by MongoDB aggregation due to missing or invalid 2dsphere indexes.
