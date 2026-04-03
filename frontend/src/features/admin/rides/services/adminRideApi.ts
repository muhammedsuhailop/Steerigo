import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import { GetAdminRidesResponse, AdminRideFilters } from "../types/ride.types";
import { API_ENDPOINTS } from "@/shared";
import { GetAdminRideByIdResponse } from "../types/ride-details.types";

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
    getAdminRideById: builder.query<GetAdminRideByIdResponse, string>({
      query: (rideId) => ({
        url: `${API_ENDPOINTS.ADMIN.RIDES}/${rideId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "AdminRide", id }],
    }),
  }),
});

export const { useGetAdminRidesQuery, useGetAdminRideByIdQuery } = adminRideApi;
