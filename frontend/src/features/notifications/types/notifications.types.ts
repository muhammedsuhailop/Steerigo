export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  metadata: unknown;
}

export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
}

export interface NotificationsResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    unreadCount: number;
    pagination: {
      total: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}

export interface NotificationSocketPayload {
  notificationId: string;
  type: string;
  title: string;
  body: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}
