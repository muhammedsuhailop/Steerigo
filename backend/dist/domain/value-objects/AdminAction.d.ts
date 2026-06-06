export declare enum AdminUserAction {
    ACTIVATE = "activate",
    DEACTIVATE = "deactivate",
    SUSPEND = "suspend",
    DELETE = "delete"
}
export declare class AdminAction {
    private readonly value;
    private constructor();
    static create(action: string): AdminAction;
    getValue(): AdminUserAction;
    isDestructive(): boolean;
}
//# sourceMappingURL=AdminAction.d.ts.map