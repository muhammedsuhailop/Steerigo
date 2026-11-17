---
name: implement-use-case
description: Step-by-step procedure for creating or updating an API use case across Clean Architecture layers with Inversify DI registration, Zod validation, and monadic Result handling.
---

# Implement Use Case

## Purpose
Enforces the repository's strict Clean Architecture layering, InversifyJS DI registration, and monadic `Result<T>` pattern when adding or modifying an application feature.

## When to Use
- Adding a new API route, query, or command.
- Modifying business orchestration in an existing use case.
- Adding a new use case required by a controller or worker.

## Preconditions
1. Verify the bounded context (`auth`, `user`, `driver`, `admin`, `payment`, `chat`, `file`, `notification`).
2. Identify whether the operation mutates state (Command) or fetches data (Query).
3. If the operation affects active rides, candidate dispatching, or payments, identify the required Redis distributed lock key from `src/shared/constants/RedisLockKeys.ts`.

## Procedure

### Step 1: Define or Update the Request/Response DTOs
- Place files in `src/application/dto/<context>/`.
- Define `RequestDto` with static factory `fromRequest(userId, payload)`.
- Include semantic validation inside `validate(): void`, throwing domain validation errors (e.g. `InvalidSearchDateRangeError`).
- Define `ResponseDto` with static factory `create(...)`.

### Step 2: Implement the Use Case Class
- Place file in `src/application/use-cases/<context>/<ActionName>UseCase.ts`.
- Decorate with `@injectable()`.
- Implement `IUseCase<RequestDto, Promise<Result<ResponseDto>>>`.
- Inject dependencies using `@inject(TYPES.<DependencyName>)`.
- Wrap execution in a `try/catch` block:
  - Return `Result.success(ResponseDto.create(...))` on success.
  - Catch `DomainError` and return `Result.failure(error)`.
  - Catch unexpected errors, log via `Logger.error(...)`, and return a formatted `Result.failure(...)`.

### Step 3: Register in Inversify DI Container
1. **Declare Symbol**: Add `ActionNameUseCase: Symbol.for("ActionNameUseCase")` to `src/shared/constants/DITypes.ts`.
2. **Bind in Factory**: Open the corresponding context factory in `src/infrastructure/container/factories/` (e.g., `UseCaseFactory.ts`, `DriverFactory.ts`, `UserFactory.ts`):
   ```typescript
   container
     .bind<IUseCase<RequestDto, Promise<Result<ResponseDto>>>>(TYPES.ActionNameUseCase)
     .to(ActionNameUseCase);
   ```

### Step 4: Add Transport Validation (Zod)
- Locate or create the validator schema in `src/interface/validators/<context>/`.
- Define schema using Zod:
  ```typescript
  export const actionSchema = z.object({
    body: z.object({ ... }),
    query: z.object({ ... }).optional(),
    params: z.object({ ... }).optional(),
  });
  ```

### Step 5: Wire Controller and Route
1. **Controller**: Add handler method in `src/interface/controllers/<context>/<Context>Controller.ts`:
   - Inject the new use case via constructor `@inject(TYPES.ActionNameUseCase)`.
   - In the method:
     ```typescript
     const dto = RequestDto.fromRequest(req.user?.userId, req.body);
     const result = await this.useCase.execute(dto);
     if (result.isFailure()) {
       const { response, statusCode } = ErrorHandlerService.handleError(result.getError());
       res.status(statusCode).json(response);
       return;
     }
     res.status(HttpStatusCodes.OK).json({ success: true, message: ..., data: result.getValue() });
     ```
2. **Route**: Mount endpoint in `src/interface/routes/<context>/<context>Routes.ts`:
   - Add `authMiddleware` if authenticated.
   - Add `requireRole([UserRole.X])` if role-restricted.
   - Add `validateSchema(actionSchema)`.
   - Call controller method: `(req, res) => controller.actionMethod(req, res)`.

## Repository-Specific Checks
- Path aliases must use `@domain/*`, `@application/*`, `@infrastructure/*`, `@interface/*`, `@shared/*`.
- Verify `DITypes.ts` symbol matches the injected symbol name exactly.
- Ensure the use case does NOT import Mongoose models directly.

## Safety Constraints
- Never throw unhandled raw exceptions from `execute()`.
- Never return raw Mongoose documents from the use case; always return DTOs.
- Do not bypass controller error handling; always route failures through `ErrorHandlerService.handleError()`.

## Verification
Run compiler and linter checks from the backend root:
```bash
npx tsc --noEmit
npm run lint
```
Both commands must exit with code 0.

## Escalation
Stop and ask the user if:
- The use case requires modifying financial transactions, but atomicity cannot be guaranteed without altering database transaction mechanics.
- The use case alters existing API response fields that external mobile/web clients may already depend on.
