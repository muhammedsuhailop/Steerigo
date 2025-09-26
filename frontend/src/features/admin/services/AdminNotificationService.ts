import { AdminNotificationService } from '../types/interfaces';

export class ToastAdminNotificationService implements AdminNotificationService {
  showSuccess(message: string): void {
    // Use your existing toast system or create a simple one
    this.showToast(message, 'success');
  }

  showError(message: string): void {
    this.showToast(message, 'error');
  }

  async showConfirmation(message: string): Promise<boolean> {
    return window.confirm(message);
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    // Simple toast implementation - you can replace with your existing system
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 p-4 rounded-md z-50 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  }
}
