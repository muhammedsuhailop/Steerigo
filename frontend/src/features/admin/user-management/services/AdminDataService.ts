import { apiClient } from "@/shared/utils/api";
import { AdminDataService } from "../../shared/types/admin.interfaces";
import type {
  User,
  UserAction,
} from "../components/UserManagement";

export class ApiAdminDataService implements AdminDataService {
  async fetchUsers(params: {
    page: number;
    pageSize: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    dateFrom?: string;
    dateTo?: string;
  }) {
    const queryParams: any = {
      page: Math.max(1, params.page),
      pageSize: Math.max(1, Math.min(params.pageSize, 100)),
      sortBy: params.sortBy || "createdAt",
      sortOrder: params.sortOrder || "desc",
    };

    if (params.search?.trim()) {
      queryParams.search = params.search.trim();
    }
    if (params.status) {
      queryParams.status = params.status;
    }
    if (params.dateFrom) {
      queryParams.dateFrom = params.dateFrom;
    }
    if (params.dateTo) {
      queryParams.dateTo = params.dateTo;
    }

    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: {
        users: User[];
        pagination?: {
          totalItems: number;
          totalPages: number;
          page: number;
          pageSize: number;
        };
      };
    }>("/api/admin/users", { params: queryParams });

    const users = Array.isArray(response.data?.users)
      ? response.data.users
      : [];
    const pagination = response.data?.pagination || {
      totalItems: users.length,
      totalPages: Math.ceil(users.length / params.pageSize),
      page: 1,
      pageSize: params.pageSize,
    };

    return {
      success: response.success || true,
      data: {
        users,
        pagination: {
          totalItems: Math.max(0, pagination.totalItems),
          totalPages: Math.max(1, pagination.totalPages),
          page: Math.max(
            1,
            Math.min(pagination.page || 1, pagination.totalPages || 1)
          ),
          pageSize: Math.max(
            1,
            Math.min(pagination.pageSize || params.pageSize, 100)
          ),
        },
      },
    };
  }

  async updateUserStatus(userId: string, action: UserAction) {
    if (!userId || userId === "undefined") {
      throw new Error(`Invalid user ID: ${userId}`);
    }
    if (!action) {
      throw new Error(`Invalid action: ${action}`);
    }

    const response = await apiClient.put(`/api/admin/users/${userId}/action`, {
      action,
    });

    return {
      success: response.success || true,
      message: response.message || "User status updated successfully",
      data: response.data,
    };
  }
}
