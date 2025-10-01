import { AdminNotificationService } from "../types/admin.interfaces";

export class ToastAdminNotificationService implements AdminNotificationService {
  showSuccess(message: string): void {
    console.log("Success:", message);
  }

  showError(message: string): void {
    console.error("Error:", message);
  }

  showInfo(message: string): void {
    console.info("Info:", message);
  }
}
