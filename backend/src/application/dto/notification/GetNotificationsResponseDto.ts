export interface NotificationData {
  id: string;
  type: string;
  channel: string;
  title: string;
  body: string;
  metadata: Record<string, string | undefined>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetNotificationsResponseDto {
  success: boolean;
  message: string;
  data: {
    notifications: NotificationData[];
    unreadCount: number;
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
