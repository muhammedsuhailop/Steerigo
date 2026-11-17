---
name: audit-wallet-transaction
description: Verification and implementation procedure for modifying or tracing double-entry digital wallet ledgers, earnings distributions, platform commissions, coupon compensations, and payouts in EarningsDistributionService.
---

# Audit Wallet Transaction

## Purpose
Ensures that all wallet balance modifications (credits, debits, compensations) and corresponding audit ledger transactions (`TransactionModel`) maintain double-entry accounting integrity, especially given that Mongoose transactions do not automatically roll back multi-step updates.

## When to Use
- Adding or modifying payment distribution logic (`EarningsDistributionService.ts`).
- Modifying driver payouts (`ApprovePayoutUseCase.ts`, `RequestPayoutUseCase.ts`).
- Implementing cancellation fee deductions or driver penalties (`distributeCancellation`).
- Debugging wallet balance discrepancies between Platform, Driver, and Rider accounts.

## Preconditions
1. Understand the distinction between **Online Payment** and **Cash Payment** ledger distributions:
   - *Online*: Platform initially receives total payable amount from Razorpay; platform pays out driver earnings to driver wallet.
   - *Cash*: Driver directly collects physical cash from rider; platform debits platform fee from driver wallet; platform reimburses driver wallet for any applied coupon discount.
2. Verify `ADMIN_WALLET_OWNER_ID` or `"platform"` is configured as the Platform wallet owner in `src/infrastructure/services/EarningsDistributionService.ts`.

## Procedure

### Step 1: Trace Double-Entry Invariants
Before altering code, verify that every balance change has an equal and opposite counterparty transaction, or represents an authorized cash collection:
1. **Total Fare Identity**:
   $$\text{Total Fare} = \text{Platform Fee} + \text{Platform Fee Tax (GST)} + \text{Driver Earnings}$$
2. **Payable Identity**:
   $$\text{Payable Amount} = \max(0, \text{Total Fare} - \text{Discount})$$
3. **Platform Net Revenue**:
   $$\text{Platform Net} = \text{Platform Revenue} - \text{Coupon Discount}$$

### Step 2: Implement or Audit Wallet Balance Operations
In `src/infrastructure/services/EarningsDistributionService.ts`:
1. **Debiting a Wallet**:
   - Always verify wallet exists: `walletRepository.findByOwner(ownerId, ownerType)`.
   - Use `wallet.debit(amount)` if balance must remain positive, or `wallet.forceDebit(amount)` if platform deductions are permitted to make the balance negative (e.g. cash ride commission deductions).
   - Save wallet: `await this.walletRepository.save(wallet)`.
2. **Recording the Audit Transaction**:
   - Immediately follow every wallet update with a `Transaction.create(...)` call.
   - Ensure the transaction attributes are populated:
     - `walletId`: ID of the affected wallet.
     - `amount`: `Money` object.
     - `direction`: `TransactionDirection.DEBIT` or `TransactionDirection.CREDIT`.
     - `type`: Explicit `TransactionType` from `@domain/value-objects/TransactionType`.
     - `relatedEntityId`: `rideId` or `payoutId`.
     - `relatedEntityType`: `"Ride"` or `"Payout"`.
     - `groupId`: Settlement group ID (e.g. `settlement_${rideId}_${timestamp}`) for idempotency checks.
   - Save transaction: `await this.transactionRepository.save(transaction)`.

### Step 3: Enforce Idempotency Guards
Always check whether the settlement has already been processed before executing balance mutations:
```typescript
if (await this.transactionRepository.existsByGroupId(groupId)) {
  Logger.warn("Settlement already processed, skipping", { groupId });
  return;
}
```

### Step 4: Verify Non-Atomic Error Handling
Because `MongoUnitOfWork` does not pass Mongoose sessions to queries:
- Defensive error logging must wrap all calls to `earningsDistributionService.distribute(...)`.
- If an operation fails midway, log full JSON metadata including `rideId`, `driverId`, `payableAmount`, and `groupId` to facilitate manual ledger correction.

## Repository-Specific Checks
- Wallet types must use `WalletOwnerType.PLATFORM`, `WalletOwnerType.DRIVER`, or `WalletOwnerType.RIDER`.
- Transaction types must use `TransactionType.*` from `@domain/value-objects/TransactionType.ts`.
- Money amounts must be represented using the immutable `Money` value object (`@domain/value-objects/Money.ts`).

## Safety Constraints
- Never deduct promotional coupon discounts from driver earnings. The platform absorbs coupon costs.
- Never credit or debit a wallet without simultaneously creating a corresponding `Transaction` record.
- Do not remove the `existsByGroupId` idempotency check.

## Verification
1. Inspect the resulting records in MongoDB:
   ```javascript
   db.wallets.find({ ownerId: { $in: ["platform", "<driverId>"] } });
   db.transactions.find({ relatedEntityId: "<rideId>" }).sort({ createdAt: -1 });
   ```
2. Verify that the sum of wallet credits and debits matches the total ride fare breakdown.
3. Run `npm run build` to confirm type safety and alias resolution.

## Escalation
Stop and ask the user if:
- A change requires modifying historical transaction ledger records.
- Wallet balances become negative and business policy does not specify whether the driver should be suspended from accepting new cash rides.
