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
  const { isLoading: driverStatsLoading, refetch: refetchDriverStats } =
    useGetDriverStatsQuery();

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
  const users = useMemo(() => usersData?.data.users ?? [], [usersData]);

  const drivers = useMemo(() => driversData?.data.drivers ?? [], [driversData]);

  const kycRequests = useMemo(
    () => kycData?.data.kycDocuments ?? [],
    [kycData]
  );

  const userPagination = usersData?.data.pagination;
  const driverPagination = driversData?.data.pagination;

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
    const totalDrivers = driverPagination?.totalItems ?? drivers.length;

    const activeDrivers = drivers.filter(
      (d) => d.statusInfo.status === "Active"
    ).length;

    const suspendedDrivers = drivers.filter(
      (d) => d.statusInfo.status === "Suspended"
    ).length;

    const blockedDrivers = drivers.filter(
      (d) => d.statusInfo.status === "Blocked"
    ).length;

    const pendingKYCDrivers = drivers.filter(
      (d) => d.statusInfo.kycStatus === "InReview"
    ).length;

    const approvedKYCDrivers = drivers.filter(
      (d) => d.statusInfo.kycStatus === "Approved"
    ).length;

    const rejectedKYCDrivers = drivers.filter(
      (d) => d.statusInfo.kycStatus === "Rejected"
    ).length;

    return {
      totalDrivers,
      activeDrivers,
      suspendedDrivers,
      blockedDrivers,
      pendingKYCDrivers,
      approvedKYCDrivers,
      rejectedKYCDrivers,
    };
  }, [drivers, driverPagination]);

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
      totalKYCRequests: kycData?.data.pagination.totalPages || 0,
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
