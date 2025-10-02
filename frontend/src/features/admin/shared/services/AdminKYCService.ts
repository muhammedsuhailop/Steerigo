import { apiClient } from "@/shared/utils/api";
import type { KYCRequest, KYCFilters, KYCAction } from "../types";

export class AdminKYCService {
  async fetchKYCRequests(params: {
    page: number;
    pageSize: number;
    filters: Partial<KYCFilters>;
  }) {
    try {
      const response = await apiClient.get("/api/admin/kyc-requests", {
        params,
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch KYC requests"
      );
    }
  }

  async fetchKYCById(requestId: string) {
    try {
      const response = await apiClient.get(`/admin/kyc-requests/${requestId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch KYC request"
      );
    }
  }

  async updateKYCStatus(requestId: string, action: KYCAction, reason?: string) {
    try {
      const response = await apiClient.patch(
        `/admin/kyc-requests/${requestId}/status`,
        {
          action,
          reason,
        }
      );
      return {
        success: true,
        message: response.data.message,
        data: response.data.request,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update KYC status"
      );
    }
  }

  async downloadDocument(documentUrl: string) {
    try {
      const response = await apiClient.get(documentUrl, {
        responseType: "blob",
      });
      return response.data;
    } catch (error: any) {
      throw new Error("Failed to download document");
    }
  }
}
