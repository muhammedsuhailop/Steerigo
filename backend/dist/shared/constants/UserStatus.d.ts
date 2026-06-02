export declare enum UserStatus {
    PENDING_VERIFICATION = "Pending Verification",
    ACTIVE = "Active",
    SUSPENDED = "Suspended",
    BLOCKED = "Blocked",
    DEACTIVATED = "Deactivated"
}
export declare const isActiveStatus: (status: string) => boolean;
export declare const canUserLogin: (status: string, isVerified: boolean) => boolean;
//# sourceMappingURL=UserStatus.d.ts.map