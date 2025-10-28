import { useCallback, useMemo } from "react";
import {
  useGetAllUsersQuery,
  useGetAllDriversQuery,
  useGetDriverStatsQuery,
  useGetKYCRequestsQuery,
} from "@/features/admin/shared/services/adminApi";

export const useAdminDashboard = () => {
  // Fetch users data with minimal params for dashboard
  const {
    data: usersData,
    isLoading: usersLoading,
    isFetching: usersFetching,
    refetch: refetchUsers,
  } = useGetAllUsersQuery({
    page: 1,
    limit: 100,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Fetch drivers data for dashboard
  const {
    data: driversData,
    isLoading: driversLoading,
    isFetching: driversFetching,
    refetch: refetchDrivers,
  } = useGetAllDriversQuery({
    page: 1,
    limit: 100,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Fetch driver statistics
  const {
    data: driverStatsData,
    isLoading: driverStatsLoading,
    refetch: refetchDriverStats,
  } = useGetDriverStatsQuery();

  // Fetch pending KYC requests
  const {
    data: kycData,
    isLoading: kycLoading,
    refetch: refetchKYC,
  } = useGetKYCRequestsQuery({
    status: "pending",
    page: 1,
    limit: 10,
  });

  // Extract data safely
  const users = usersData?.data.users || [];
  const drivers = driversData?.data.drivers || [];
  const userPagination = usersData?.data.pagination;
  const driverPagination = driversData?.data.pagination;
  const kycRequests = kycData?.data.kycDocuments || [];

  // Calculate user statistics from fetched data

  const getUserStats = useMemo(() => {
    const totalUsers = userPagination?.totalItems || 0;
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
    };
  }, [users, userPagination]);

  // Calculate driver statistics

  const getDriverStats = useMemo(() => {
    const totalDrivers = driverPagination?.totalItems || 0;
    const activeDrivers = drivers.filter((d) => d.status === "active").length;
    const pendingDrivers = drivers.filter((d) => d.status === "pending").length;
    const suspendedDrivers = drivers.filter(
      (d) => d.status === "suspended"
    ).length;

    // Use backend stats if available
    const backendStats = driverStatsData?.data;

    return {
      totalDrivers: backendStats?.totalDrivers || totalDrivers,
      activeDrivers: backendStats?.activeDrivers || activeDrivers,
      pendingDrivers: backendStats?.pendingApproval || pendingDrivers,
      suspendedDrivers: backendStats?.suspendedDrivers || suspendedDrivers,
    };
  }, [drivers, driverPagination, driverStatsData]);

  // Get recent users (last 5)

  const getRecentUsers = useMemo(() => {
    return users.slice(0, 5);
  }, [users]);

  // Get recent drivers (last 5)

  const getRecentDrivers = useMemo(() => {
    return drivers.slice(0, 5);
  }, [drivers]);

  // Get KYC statistics

  const getKYCStats = useMemo(() => {
    return {
      pendingKYC: kycRequests.length,
      totalKYCRequests: kycData?.data.pagination.total || 0,
    };
  }, [kycRequests, kycData]);

  // Get complete dashboard statistics

  const getDashboardStats = useCallback(() => {
    return {
      // User stats
      ...getUserStats,

      // Driver stats
      ...getDriverStats,

      // KYC stats
      ...getKYCStats,

      // Recent data
      recentUsers: getRecentUsers,
      recentDrivers: getRecentDrivers,
      recentKYCRequests: kycRequests.slice(0, 5),
    };
  }, [
    getUserStats,
    getDriverStats,
    getKYCStats,
    getRecentUsers,
    getRecentDrivers,
    kycRequests,
  ]);

  // Refresh all dashboard data

  const refreshDashboardData = useCallback(() => {
    refetchUsers();
    refetchDrivers();
    refetchDriverStats();
    refetchKYC();
  }, [refetchUsers, refetchDrivers, refetchDriverStats, refetchKYC]);

  // Check if any data is loading
  const isLoading =
    usersLoading || driversLoading || driverStatsLoading || kycLoading;
  const isFetching = usersFetching || driversFetching;

  return {
    // Main function
    getDashboardStats,
    refreshDashboardData,

    // Loading states
    loading: isLoading,
    isFetching,

    // Raw data (if needed)
    users,
    drivers,
    kycRequests,
    userPagination,
    driverPagination,

    // Individual stats getters
    getUserStats,
    getDriverStats,
    getKYCStats,
    getRecentUsers,
    getRecentDrivers,
  };
};
