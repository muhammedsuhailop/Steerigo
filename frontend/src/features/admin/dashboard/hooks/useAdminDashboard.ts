import { useState, useCallback, useMemo, useEffect } from "react";
import {
  useGetAdminUserStatsQuery,
  useGetAdminRideStatsQuery,
  useGetAdminDriverStatsQuery,
} from "../services/adminDashboardApi";
import {
  useGetAllUsersQuery,
  useGetAllDriversQuery,
  useGetKYCRequestsQuery,
} from "@/features/admin/shared/services/adminApi";

export type DateFilterOption =
  | "today"
  | "7days"
  | "1month"
  | "3months"
  | "6months"
  | "1year"
  | "all"
  | "custom";

export const useAdminDashboard = () => {
  const [filter, setFilter] = useState<DateFilterOption>("7days");

  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);

  useEffect(() => {
    if (filter === "custom") {
      const current = new Date();
      const past = new Date();
      past.setDate(current.getDate() - 7);

      setFromDate(past);
      setToDate(current);
    } else {
      setFromDate(null);
      setToDate(null);
    }
  }, [filter]);

  const dateParams = useMemo(() => {
    if (filter === "all") return undefined;

    if (filter === "custom") {
      if (!fromDate || !toDate) return undefined;
      return {
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
      };
    }

    const toDateStr = new Date().toISOString();
    const from = new Date();

    switch (filter) {
      case "today":
        from.setHours(0, 0, 0, 0);
        break;
      case "7days":
        from.setDate(from.getDate() - 7);
        break;
      case "1month":
        from.setMonth(from.getMonth() - 1);
        break;
      case "3months":
        from.setMonth(from.getMonth() - 3);
        break;
      case "6months":
        from.setMonth(from.getMonth() - 6);
        break;
      case "1year":
        from.setFullYear(from.getFullYear() - 1);
        break;
      default:
        return undefined;
    }

    return {
      fromDate: from.toISOString(),
      toDate: toDateStr,
    };
  }, [filter, fromDate, toDate]);

  const {
    data: userStats,
    isLoading: userStatsLoading,
    refetch: refetchUserStats,
  } = useGetAdminUserStatsQuery(dateParams);

  const {
    data: rideStats,
    isLoading: rideStatsLoading,
    refetch: refetchRideStats,
  } = useGetAdminRideStatsQuery(dateParams);

  const {
    data: driverStats,
    isLoading: driverStatsLoading,
    refetch: refetchDriverStats,
  } = useGetAdminDriverStatsQuery(dateParams);

  const {
    data: usersData,
    isLoading: usersLoading,
    refetch: refetchUsers,
  } = useGetAllUsersQuery({
    page: 1,
    limit: 5,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const {
    data: driversData,
    isLoading: driversLoading,
    refetch: refetchDrivers,
  } = useGetAllDriversQuery({
    page: 1,
    limit: 5,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const {
    data: kycData,
    isLoading: kycLoading,
    refetch: refetchKYC,
  } = useGetKYCRequestsQuery({
    status: "pending",
    page: 1,
    limit: 5,
  });

  const recentUsers = useMemo(() => usersData?.data.users ?? [], [usersData]);
  const recentDrivers = useMemo(
    () => driversData?.data.drivers ?? [],
    [driversData],
  );
  const recentKYCRequests = useMemo(
    () => kycData?.data.kycDocuments ?? [],
    [kycData],
  );

  const getDashboardStats = useCallback(() => {
    return {
      // User Stats
      totalUsers: userStats?.totalUsers ?? 0,
      newUsers: userStats?.newUsers ?? 0,

      // Driver Stats
      totalDrivers: driverStats?.driverStats.totalDrivers ?? 0,
      activeDrivers: driverStats?.driverStats.statusBreakdown.active ?? 0,
      suspendedDrivers: driverStats?.driverStats.statusBreakdown.suspended ?? 0,
      blockedDrivers: driverStats?.driverStats.statusBreakdown.blocked ?? 0,
      pendingKYCDrivers: driverStats?.driverStats.kycBreakdown.inReview ?? 0,
      approvedKYCDrivers: driverStats?.driverStats.kycBreakdown.approved ?? 0,

      // Ride & Revenue Stats
      totalRides: rideStats?.rideStats.totalRides ?? 0,
      completedRides: rideStats?.rideStats.completedRides ?? 0,
      cancelledRides: rideStats?.rideStats.cancelledRides ?? 0,
      totalRevenue: rideStats?.rideStats.totalAmount ?? 0,
      currency: rideStats?.rideStats.currency ?? "INR",
      averageRating: rideStats?.ratingStats.averageRating ?? 0,

      // Lists
      recentUsers,
      recentDrivers,
      recentKYCRequests,
    };
  }, [
    userStats,
    driverStats,
    rideStats,
    recentUsers,
    recentDrivers,
    recentKYCRequests,
  ]);

  const refreshDashboardData = useCallback(() => {
    refetchUserStats();
    refetchRideStats();
    refetchDriverStats();
    refetchUsers();
    refetchDrivers();
    refetchKYC();
  }, [
    refetchUserStats,
    refetchRideStats,
    refetchDriverStats,
    refetchUsers,
    refetchDrivers,
    refetchKYC,
  ]);

  const isLoading =
    userStatsLoading ||
    rideStatsLoading ||
    driverStatsLoading ||
    usersLoading ||
    driversLoading ||
    kycLoading;

  return {
    getDashboardStats,
    refreshDashboardData,
    loading: isLoading,
    filter,
    setFilter,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    rawStats: {
      user: userStats,
      ride: rideStats,
      driver: driverStats,
    },
    recentUsers,
    recentDrivers,
    recentKYCRequests,
  };
};
