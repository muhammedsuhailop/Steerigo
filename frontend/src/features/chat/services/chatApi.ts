import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/shared/utils/axiosBaseQuery";
import { API_ENDPOINTS } from "@/shared/constants/api";
import {
  GetRideChatRoomResponse,
  GetChatMessagesResponse,
  SendChatMessageResponse,
  EditChatMessageResponse,
  DeleteChatMessageResponse,
} from "../types/chat.types";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["ChatRoom", "ChatMessages"],
  endpoints: (builder) => ({
    getChatRoomByRideId: builder.query<GetRideChatRoomResponse, string>({
      query: (rideId) => ({
        url: API_ENDPOINTS.CHAT.BY_RIDE(rideId),
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [{ type: "ChatRoom", id: result.data.chatRoomId }]
          : ["ChatRoom"],
    }),

    getChatMessages: builder.query<
      GetChatMessagesResponse,
      { chatRoomId: string; page?: number; limit?: number }
    >({
      query: ({ chatRoomId, ...params }) => ({
        url: API_ENDPOINTS.CHAT.MESSAGES(chatRoomId),
        method: "GET",
        params,
      }),
      providesTags: ["ChatMessages"],
    }),

    sendChatMessage: builder.mutation<
      SendChatMessageResponse,
      { chatRoomId: string; content: string }
    >({
      query: ({ chatRoomId, content }) => ({
        url: API_ENDPOINTS.CHAT.MESSAGES(chatRoomId),
        method: "POST",
        data: { content },
      }),
    }),

    editChatMessage: builder.mutation<
      EditChatMessageResponse,
      { messageId: string; content: string }
    >({
      query: ({ messageId, content }) => ({
        url: API_ENDPOINTS.CHAT.MESSAGE_BY_ID(messageId),
        method: "PATCH",
        data: { content },
      }),
    }),

    deleteChatMessage: builder.mutation<DeleteChatMessageResponse, string>({
      query: (messageId) => ({
        url: API_ENDPOINTS.CHAT.MESSAGE_BY_ID(messageId),
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetChatRoomByRideIdQuery,
  useGetChatMessagesQuery,
  useSendChatMessageMutation,
  useEditChatMessageMutation,
  useDeleteChatMessageMutation,
} = chatApi;
