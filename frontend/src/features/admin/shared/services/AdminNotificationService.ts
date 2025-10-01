import { AdminNotificationService } from "../types/admin.interfaces";

export class ToastAdminNotificationService implements AdminNotificationService {
  showSuccess(message: string): void {
    // TODO
    this.createToast(message, "success");
  }

  showError(message: string): void {
    this.createToast(message, "error");
  }

  showInfo(message: string): void {
    this.createToast(message, "info");
  }

  private createToast(
    message: string,
    type: "success" | "error" | "info"
  ): void {
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 transform translate-x-full ${
      type === "success"
        ? "bg-emerald-600"
        : type === "error"
        ? "bg-red-600"
        : "bg-blue-600"
    }`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.remove("translate-x-full");
    }, 10);

    // Animate out and remove
    setTimeout(() => {
      toast.classList.add("translate-x-full");
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }
}
