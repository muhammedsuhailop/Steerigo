export interface AccountStatusMessageStrategy {
    getMessage(): string;
}
export declare class SuspendedAccountStrategy implements AccountStatusMessageStrategy {
    getMessage(): string;
}
export declare class BlockedAccountStrategy implements AccountStatusMessageStrategy {
    getMessage(): string;
}
export declare class DeactivatedAccountStrategy implements AccountStatusMessageStrategy {
    getMessage(): string;
}
export declare class PendingVerificationStrategy implements AccountStatusMessageStrategy {
    getMessage(): string;
}
export declare class DefaultAccountStatusStrategy implements AccountStatusMessageStrategy {
    getMessage(): string;
}
//# sourceMappingURL=AccountStatusMessageStrategy.d.ts.map