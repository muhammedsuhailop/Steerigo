import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import type {
  DriverSearchResponse,
  SearchNearbyDriversPayload,
} from "../types/driverSearch.types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const driverSearchApi = createApi({
  reducerPath: "driverSearchApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["DriverSearch"],
  endpoints: (builder) => ({
    // Search nearby drivers
    searchNearbyDrivers: builder.mutation<
      DriverSearchResponse,
      SearchNearbyDriversPayload
    >({
      query: (payload) => ({
        url: `/user/search/nearby`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["DriverSearch"],
    }),
  }),
});

export const { useSearchNearbyDriversMutation } = driverSearchApi;
