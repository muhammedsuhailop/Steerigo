export interface MarkNotificationsReadResponseDto {
  success: boolean;
  message: string;
  data: {
    updatedCount: number;
  };
}
