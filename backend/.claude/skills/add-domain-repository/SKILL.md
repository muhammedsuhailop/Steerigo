---
name: add-domain-repository
description: Step-by-step procedure for creating or updating a domain entity, Mongoose schema/model, bidirectional persistence mapper, repository contract, implementation, and Inversify DI registration.
---

# Add Domain Repository

## Purpose
Enforces the repository's strict separation between pure Domain Entities, Mongoose Documents, and Repository Interfaces when introducing or refactoring a persistence aggregate.

## When to Use
- Creating a new persistent domain aggregate or entity.
- Adding database queries to a repository.
- Introducing a new Mongoose collection or indexes.

## Preconditions
1. Verify that business rules and state invariants belong in the Domain Entity, not in the Mongoose schema or repository implementation.
2. Confirm that Mongoose documents will NOT be exposed to the Application or Interface layers.

## Procedure

### Step 1: Create the Domain Entity & Value Objects
1. Create `src/domain/entities/<EntityName>.ts`.
2. Make constructor `private`.
3. Create static factories:
   - `create(...)`: Validates initial invariants and applies defaults.
   - `fromData(...)` / `reconstruct(...)`: Hydrates existing database records into the entity.
4. Expose business methods (e.g. state transitions) that protect entity invariants.
5. Define the repository contract interface in `src/domain/repositories/I<EntityName>Repository.ts` extending `IBaseRepository` or `ICrudRepository` where appropriate.

### Step 2: Create the Mongoose Schema & Model
1. Create `src/infrastructure/database/models/<EntityName>Model.ts`.
2. Define the TypeScript document interface `I<EntityName>Document extends Document`.
3. Define the Mongoose schema `new Schema<I<EntityName>Document>({ ... }, { timestamps: true })`.
4. Apply required indexes:
   - Unique indexes where applicable.
   - 2dsphere indexes if containing GeoJSON `{ type: "Point", coordinates: [lng, lat] }`.
   - TTL indexes (`expireAfterSeconds`) for transient records.
5. Export model: `export const <EntityName>Model = model<I<EntityName>Document>("<EntityName>", schema)`.

### Step 3: Implement the Persistence Mapper
1. Create `src/infrastructure/database/mappers/<EntityName>Mapper.ts`.
2. Implement bidirectional conversion:
   - `static toDomain(doc: I<EntityName>Document): <EntityName>`: Hydrates the domain entity via `Entity.fromData(...)`. Uses `toObjectId` and `toStringId` from `@shared/utils/idHelper`.
   - `static toPersistence(entity: <EntityName>): Record<string, unknown>`: Extracts raw domain properties for Mongoose writes.

### Step 4: Implement the Repository Class
1. Create `src/infrastructure/database/repositories/<EntityName>RepositoryImpl.ts`.
2. Decorate with `@injectable()`.
3. Implement `I<EntityName>Repository`.
4. Wrap Mongoose queries with Winston error logging (`Logger.error(...)`).
5. Map results using `<EntityName>Mapper.toDomain(doc)`.

### Step 5: Register in Inversify DI Container
1. **Declare Symbol**: Add token in `src/shared/constants/DITypes.ts`:
   ```typescript
   <EntityName>Repository: Symbol.for("<EntityName>Repository"),
   ```
2. **Bind in Factory**: Open `src/infrastructure/container/factories/RepositoryFactory.ts` and add binding:
   ```typescript
   container
     .bind<I<EntityName>Repository>(TYPES.<EntityName>Repository)
     .to(<EntityName>RepositoryImpl);
   ```

## Repository-Specific Checks
- Never import Mongoose or Mongoose types inside `src/domain/`.
- Ensure GeoJSON coordinates are ordered `[longitude, latitude]` for 2dsphere indexes.
- Verify path aliases use `@domain/*` and `@infrastructure/*`.

## Safety Constraints
- Repositories must never return Mongoose documents; always return Domain Entities or plain DTOs.
- Do not add `.inSingletonScope()` to repository bindings unless the repository is purely stateless or manages an in-memory cache.
- Never hardcode MongoDB database names in model files.

## Verification
1. Run TypeScript compilation:
   ```bash
   npx tsc --noEmit
   npm run build
   ```
2. Run linter check:
   ```bash
   npm run lint
   ```
3. Both must pass with exit code 0.

## Escalation
Stop and ask the user if:
- Adding a compound index to a large existing collection in production could cause blocking background builds.
- A new aggregate shares identity with both User and Driver entities (avoid dual-identity ambiguity).
