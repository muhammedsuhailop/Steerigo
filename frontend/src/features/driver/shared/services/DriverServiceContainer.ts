import { AppDispatch } from "@/app/store";
import {
  DriverDataService,
  DriverStateService,
  DriverNotificationService,
} from "../types/driver.interfaces";
import { MockDriverDataService } from "./DriverDataService";
import { ReduxDriverStateService } from "./DriverStateService";
import { ToastDriverNotificationService } from "./DriverNotificationService";

export interface DriverServices {
  dataService: DriverDataService;
  stateService: DriverStateService;
  notificationService: DriverNotificationService;
}

export class DriverServiceContainer {
  private static instance: DriverServiceContainer;
  private services: DriverServices | null = null;

  static getInstance(): DriverServiceContainer {
    if (!DriverServiceContainer.instance) {
      DriverServiceContainer.instance = new DriverServiceContainer();
    }
    return DriverServiceContainer.instance;
  }

  initialize(dispatch: AppDispatch): void {
    this.services = {
      dataService: new MockDriverDataService(), // Use mock for development
      stateService: new ReduxDriverStateService(dispatch),
      notificationService: new ToastDriverNotificationService(),
    };
  }

  getServices(): DriverServices {
    if (!this.services) {
      throw new Error(
        "DriverServiceContainer not initialized. Call initialize() first."
      );
    }
    return this.services;
  }
}
