import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import { API_ENDPOINTS } from "@/shared/constants/api";
import { ViewDriverRideResponse } from "../viewDriverRide.types";
import { RideStatus } from "@/shared/types/ride.types";

export const viewDriverRideApi = createApi({
  reducerPath: "viewDriverRideApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["DriverRide"],
  endpoints: (builder) => ({
    getDriverRideDetails: builder.query<ViewDriverRideResponse, string>({
      query: (id) => ({
        url: `${API_ENDPOINTS.DRIVER.RIDE}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "DriverRide", id }],
    }),

    updateRideStatus: builder.mutation<
      { success: boolean; message: string },
      { rideId: string; status: RideStatus }
    >({
      query: ({ rideId, status }) => ({
        url: `${API_ENDPOINTS.DRIVER.RIDE}/${rideId}/status`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: (result, error, { rideId }) => [
        { type: "DriverRide", id: rideId },
      ],
    }),
  }),
});

export const { useGetDriverRideDetailsQuery, useUpdateRideStatusMutation } =
  viewDriverRideApi;
