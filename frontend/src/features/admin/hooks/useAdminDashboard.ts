import { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAdminUsers } from "../store/adminUsersSlice";
import type { RootState, AppDispatch } from "@/app/store";

export const useAdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    users = [],
    pagination,
    loading,
  } = useSelector((state: RootState) => state.adminUsers || {});

  // Fetch initial data for dashboard
  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  const getDashboardStats = useCallback(() => {
    const totalUsers = pagination?.totalItems || 0;
    const activeUsers = users.filter((u) => u.status === "Active").length;
    const pendingUsers = users.filter(
      (u) => u.status === "Pending Verification"
    ).length;
    const inactiveUsers = users.filter((u) => u.status === "Inactive").length;
    const suspendedUsers = users.filter((u) => u.status === "Suspended").length;
    const blockedUsers = users.filter((u) => u.status === "Blocked").length;

    return {
      totalUsers,
      activeUsers,
      pendingUsers,
      inactiveUsers,
      suspendedUsers,
      blockedUsers,
      recentUsers: users.slice(0, 5), //TODO
    };
  }, [users, pagination]);

  const refreshDashboardData = useCallback(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  return {
    getDashboardStats,
    refreshDashboardData,
    loading,
    users,
    pagination,
  };
};
