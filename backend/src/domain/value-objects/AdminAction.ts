export enum AdminUserAction {
  ACTIVATE = "activate",
  DEACTIVATE = "deactivate",
  SUSPEND = "suspend",
  DELETE = "delete",
}

export class AdminAction {
  private constructor(private readonly value: AdminUserAction) {}

  static create(action: string): AdminAction {
    if (!Object.values(AdminUserAction).includes(action as AdminUserAction)) {
      throw new Error(`Invalid admin action: ${action}`);
    }
    return new AdminAction(action as AdminUserAction);
  }

  getValue(): AdminUserAction {
    return this.value;
  }

  isDestructive(): boolean {
    return (
      this.value === AdminUserAction.DELETE ||
      this.value === AdminUserAction.SUSPEND
    );
  }
}
