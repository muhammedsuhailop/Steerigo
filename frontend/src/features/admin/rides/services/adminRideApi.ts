import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import { GetAdminRidesResponse, AdminRideFilters } from "../types/ride.types";
import { API_ENDPOINTS } from "@/shared";

export const adminRideApi = createApi({
  reducerPath: "adminRideApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["AdminRide"],
  endpoints: (builder) => ({
    getAdminRides: builder.query<GetAdminRidesResponse, AdminRideFilters>({
      query: (params) => ({
        url: API_ENDPOINTS.ADMIN.RIDES,
        method: "GET",
        params,
      }),
      providesTags: ["AdminRide"],
    }),
  }),
});

export const { useGetAdminRidesQuery } = adminRideApi;
