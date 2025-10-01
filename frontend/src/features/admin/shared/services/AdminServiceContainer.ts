import { AppDispatch } from "@/app/store";
import {
  AdminDataService,
  AdminStateService,
  AdminNotificationService,
  AdminAnalyticsService,
  AdminStatsService,
} from "../types/admin.interfaces";
import { ReduxAdminStateService } from "./AdminStateService";
import { ToastAdminNotificationService } from "./AdminNotificationService";
import { ApiAdminDataService } from "../../user-management/services/AdminDataService";
import { LocalAdminStatsService } from "./AdminStatsService";

export interface AdminServices {
  dataService: AdminDataService;
  stateService: AdminStateService;
  notificationService: AdminNotificationService;
  statsService: AdminStatsService;
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
      statsService: new LocalAdminStatsService(),
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
