import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import { API_ENDPOINTS } from "@/shared/constants/api";
import type {
  UserRidesResponse,
  UserRidesFilters,
} from "../types/userRides.types";
import { ApiResponse } from "@/shared/api/types/errors";

export const userRidesApi = createApi({
  reducerPath: "userRidesApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["UserRides"],
  endpoints: (builder) => ({
    getUserRides: builder.query<UserRidesResponse, Partial<UserRidesFilters>>({
      query: (params) => {
        const sanitizedParams = {
          ...params,
          page: params.page ? Number(params.page) : 1,
          limit: params.limit ? Number(params.limit) : 10,
        };

        return {
          url: API_ENDPOINTS.USER.RIDES,
          method: "GET",
          params: sanitizedParams,
        };
      },
      transformResponse: (
        response: ApiResponse<UserRidesResponse>,
      ): UserRidesResponse => {
        return (
          response.data || {
            rides: [],
            pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
          }
        );
      },
      providesTags: ["UserRides"],
    }),
  }),
});

export const { useGetUserRidesQuery } = userRidesApi;
