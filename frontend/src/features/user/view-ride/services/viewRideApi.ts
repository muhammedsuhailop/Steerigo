import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import { API_ENDPOINTS } from "@/shared/constants/api";
import { ViewRideResponse } from "../types/viewRide.types";

export const viewRideApi = createApi({
  reducerPath: "viewRideApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Ride"],
  endpoints: (builder) => ({
    getRideDetails: builder.query<ViewRideResponse, string>({
      query: (id) => ({
        url: `${API_ENDPOINTS.USER.RIDE}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Ride", id }],
    }),

    cancelActiveRide: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (rideId) => ({
        url: `${API_ENDPOINTS.USER.RIDE}/${rideId}/cancel`,
        method: "POST",
        data: { rideId },
      }),
      invalidatesTags: ["Ride"],
    }),
  }),
});

export const { useGetRideDetailsQuery, useCancelActiveRideMutation } =
  viewRideApi;
