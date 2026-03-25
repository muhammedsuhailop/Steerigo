import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import type {
  DriverRidesResponse,
  RidesFilters,
} from "../types/driverRides.types";
import { API_ENDPOINTS } from "@/shared";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const driverRidesApi = createApi({
  reducerPath: "driverRidesApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["DriverRides"],
  endpoints: (builder) => ({
    getDriverRides: builder.query<DriverRidesResponse, Partial<RidesFilters>>({
      query: (params) => ({
        url: API_ENDPOINTS.DRIVER.RIDES,
        method: "GET",
        params,
      }),
      transformResponse: (response: ApiResponse<DriverRidesResponse>) =>
        response.data,
      providesTags: ["DriverRides"],
    }),
  }),
});

export const { useGetDriverRidesQuery } = driverRidesApi;
