import { AdminDataService } from "../types/admin.interfaces";
import type {
  User,
  UserFilters,
  UserAction,
} from "../../user-management/components/UserManagement/UserManagement.types";

export class ApiAdminDataService implements AdminDataService {
  private baseUrl = "/api/admin";

  async fetchUsers(params: {
    page: number;
    pageSize: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{
    success: boolean;
    data: {
      users: User[];
      pagination: {
        totalItems: number;
        totalPages: number;
        page: number;
        pageSize: number;
      };
    };
  }> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${this.baseUrl}/users?${queryParams}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async updateUserStatus(
    userId: string,
    action: UserAction
  ): Promise<{
    success: boolean;
    message: string;
    data?: any;
  }> {
    const response = await fetch(`${this.baseUrl}/users/${userId}/action`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ action }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}
