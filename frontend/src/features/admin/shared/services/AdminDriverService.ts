import { apiClient } from "@/shared/utils";
import type { Driver, DriverFilters, DriverAction } from "../types";

export class AdminDriverService {
  async fetchDrivers(params: {
    page: number;
    pageSize: number;
    filters: Partial<DriverFilters>;
  }) {
    try {
      const queryParams = {
        page: params.page,
        pageSize: params.pageSize,
        ...params.filters,
      };
      const response = await apiClient.get("/admin/drivers", {
        params: queryParams,
      });
      return {
        success: true,
        data: response,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch drivers"
      );
    }
  }

  async fetchDriverById(driverId: string) {
    try {
      const response = await apiClient.get(`/admin/drivers/${driverId}/profile`);
      return {
      success: true,
      data: response.data, 
    };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch driver"
      );
    }
  }

  async updateDriverStatus(
    driverId: string,
    action: DriverAction,
    reason?: string
  ) {
    try {
      const response = await apiClient.put(
        `/admin/drivers/${driverId}/action`,
        {
          action,
          reason,
        }
      );
      return {
        success: true,
        message: response.message,
        data: response.driver,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update driver status"
      );
    }
  }

  async getDriverStats() {
    try {
      const response = await apiClient.get("/admin/drivers/stats");
      return {
        success: true,
        data: response,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch driver stats"
      );
    }
  }
}
