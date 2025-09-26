import { AppDispatch } from "@/app/store";
import {
  AdminDataService,
  AdminStateService,
  AdminNotificationService,
  AdminAnalyticsService,
} from "../types/admin.interfaces";
import { ReduxAdminStateService } from "./AdminStateService";
import { ToastAdminNotificationService } from "./AdminNotificationService";
import { ApiAdminDataService } from "./AdminDataService";

export interface AdminServices {
  dataService: AdminDataService;
  stateService: AdminStateService;
  notificationService: AdminNotificationService;
  analyticsService?: AdminAnalyticsService;
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

  initialize(dispatch: AppDispatch): void {
    this.services = {
      dataService: new ApiAdminDataService(),
      stateService: new ReduxAdminStateService(dispatch),
      notificationService: new ToastAdminNotificationService(),
    };
  }

  getServices(): AdminServices {
    if (!this.services) {
      throw new Error(
        "AdminServiceContainer not initialized. Call initialize() first."
      );
    }
    return this.services;
  }
}
