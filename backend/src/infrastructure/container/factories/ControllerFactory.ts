import { Container } from "inversify";
import { TYPES } from "@shared/constants/DITypes";

import { LoginController } from "@interface/controllers/auth/LoginController";
import { UserAuthController } from "@interface/controllers/auth/UserAuthController";
import { TokenController } from "@interface/controllers/auth/TokenController";
import { SignupController } from "@interface/controllers/auth/SignupController";
import { PasswordController } from "@interface/controllers/auth/PasswordController";
import { OtpController } from "@interface/controllers/auth/OtpController";
import { SocialAuthController } from "@interface/controllers/auth/SocialAuthController";
import { DriverSearchController } from "@interface/controllers/user/DriverSearchController";
import { AutoRideController } from "@interface/controllers/user/AutoRideController";
import { DriverRideController } from "@interface/controllers/driver/DriverRideController";
import { DriverRideActionsController } from "@interface/controllers/driver/DriverRideActionsController";

export class ControllerFactory {
  static register(container: Container): void {
    container.bind(TYPES.LoginController).to(LoginController);
    container.bind(TYPES.UserAuthController).to(UserAuthController);
    container.bind(TYPES.TokenController).to(TokenController);
    container.bind(TYPES.SignupController).to(SignupController);
    container.bind(TYPES.PasswordController).to(PasswordController);
    container.bind(TYPES.OtpController).to(OtpController);
    container.bind(TYPES.SocialAuthController).to(SocialAuthController);
    container.bind(TYPES.DriverSearchController).to(DriverSearchController);
    container.bind(TYPES.AutoRideController).to(AutoRideController);
    container.bind(TYPES.DriverRideController).to(DriverRideController);
    container
      .bind(TYPES.DriverRideActionsController)
      .to(DriverRideActionsController);
  }
}
