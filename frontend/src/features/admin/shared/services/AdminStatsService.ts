import { AdminStatsService } from "../types";
import type { User } from "../../user-management/components/UserManagement";

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  inactiveUsers: number;
  suspendedUsers: number;
  blockedUsers: number;
  recentUsers: User[];
  systemHealth: {
    serverStatus: "online" | "offline" | "maintenance";
    databaseStatus: "connected" | "disconnected" | "slow";
    paymentGateway: "active" | "inactive" | "error";
  };
}

export class LocalAdminStatsService implements AdminStatsService {
  calculateStats(users: User[], pagination?: any): DashboardStats {
    const totalUsers = pagination?.totalItems || users.length;
    const activeUsers = users.filter((u) => u.status === "Active").length;
    const pendingUsers = users.filter(
      (u) => u.status === "Pending Verification"
    ).length;
    const inactiveUsers = users.filter((u) => u.status === "Inactive").length;
    const suspendedUsers = users.filter((u) => u.status === "Suspended").length;
    const blockedUsers = users.filter((u) => u.status === "Blocked").length;

    // Sort by creation date and take recent users
    const recentUsers = [...users]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);

    return {
      totalUsers,
      activeUsers,
      pendingUsers,
      inactiveUsers,
      suspendedUsers,
      blockedUsers,
      recentUsers,
      systemHealth: {
        serverStatus: "online",
        databaseStatus: "connected",
        paymentGateway: "active",
      },
    };
  }
}
