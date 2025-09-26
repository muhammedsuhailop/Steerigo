import { NavigateFunction } from 'react-router-dom';
import { AdminNavigationService } from '../types/interfaces';

export class BrowserAdminNavigationService implements AdminNavigationService {
  constructor(private navigate: NavigateFunction) {}

  navigateToUsers(): void {
    this.navigate('/admin/users');
  }

  navigateToDashboard(): void {
    this.navigate('/admin/dashboard');
  }

  refreshCurrentPage(): void {
    window.location.reload();
  }
}
