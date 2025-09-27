import { DriverNotificationService } from "../types/driver.interfaces";
import type { RideRequest } from "../types/driver.types";

export class ToastDriverNotificationService
  implements DriverNotificationService
{
  showSuccess(message: string): void {
    this.createToast(message, "success");
  }

  showError(message: string): void {
    this.createToast(message, "error");
  }

  showInfo(message: string): void {
    this.createToast(message, "info");
  }

  showRideRequest(request: RideRequest): void {
    this.playNotificationSound();
    this.createRideRequestNotification(request);
  }

  playNotificationSound(): void {
    // Create audio notification for ride requests
    try {
      const audio = new Audio("/sounds/ride-request.mp3");
      audio.volume = 0.5;
      audio.play().catch(() => {
        // Fallback: use system beep if audio file not available
        if ("vibrate" in navigator) {
          navigator.vibrate([200, 100, 200]);
        }
      });
    } catch (error) {
      console.warn("Could not play notification sound:", error);
    }
  }

  private createToast(
    message: string,
    type: "success" | "error" | "info"
  ): void {
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 transform translate-x-full max-w-sm ${
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
    }, 4000);
  }

  private createRideRequestNotification(request: RideRequest): void {
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-4 max-w-sm transform translate-x-full transition-all duration-300`;

    notification.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        <div class="flex-1">
          <h4 class="text-sm font-semibold text-gray-900">New Ride Request</h4>
          <p class="text-sm text-gray-600 mt-1">${request.passengerName}</p>
          <p class="text-xs text-gray-500 mt-1">₹${request.estimatedFare} • ${request.distance}km</p>
          <p class="text-xs text-gray-500">${request.pickupLocation.address}</p>
        </div>
        <button class="text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.remove("translate-x-full");
    }, 10);

    // Auto remove after 10 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.classList.add("translate-x-full");
        setTimeout(() => {
          if (notification.parentElement) {
            document.body.removeChild(notification);
          }
        }, 300);
      }
    }, 10000);
  }
}
