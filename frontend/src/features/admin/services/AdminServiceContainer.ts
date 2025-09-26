import { NavigateFunction } from 'react-router-dom';
import { AppDispatch } from '@/app/store';
import { AdminDataService, AdminStateService, AdminNavigationService, AdminNotificationService } from '../types/interfaces';
import { ReduxAdminStateService } from './AdminStateService';
import { BrowserAdminNavigationService } from './AdminNavigationService';
import { ToastAdminNotificationService } from './AdminNotificationService';
import { ApiAdminDataService } from '.';

export interface AdminServices {
  dataService: AdminDataService;
  stateService: AdminStateService;
  navigationService: AdminNavigationService;
  notificationService: AdminNotificationService;
}

export class AdminServiceContainer {
  private static instance: AdminServiceContainer;
  private services: AdminServices | null = null;

  static getInstance(): AdminServiceContainer {
    if (!AdminServiceContainer.instance) {
      AdminServiceContainer.instance = new AdminServiceContainer();
    }
    return AdminServiceContainer.instance;
  }

  initialize(dispatch: AppDispatch, navigate: NavigateFunction): void {
    this.services = {
      dataService: new ApiAdminDataService(),
      stateService: new ReduxAdminStateService(dispatch),
      navigationService: new BrowserAdminNavigationService(navigate),
      notificationService: new ToastAdminNotificationService(),
    };
  }

  getServices(): AdminServices {
    if (!this.services) {
      throw new Error('AdminServiceContainer not initialized. Call initialize() first.');
    }
    return this.services;
  }
}
