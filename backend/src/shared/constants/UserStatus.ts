export enum UserStatus {
  PENDING_VERIFICATION = "Pending Verification",
  ACTIVE = "Active",
  SUSPENDED = "Suspended",
  BLOCKED = "Blocked",
  DEACTIVATED = "Deactivated",
}

// Helper functions
export const isActiveStatus = (status: string): boolean => {
  return status === UserStatus.ACTIVE;
};

export const canUserLogin = (status: string, isVerified: boolean): boolean => {
  return isVerified && isActiveStatus(status);
};
