import { Container } from "inversify";
import { TYPES } from "@shared/constants/DITypes";
import { SendRideRequestUseCase } from "@application/use-cases/user/SendRideRequestUseCase";
import { RideController } from "@interface/controllers/user/RideController";

export class RideRequestFactory {
  static register(container: Container): void {
    // Use Cases
    container
      .bind<SendRideRequestUseCase>(TYPES.SendRideRequestUseCase)
      .to(SendRideRequestUseCase);

    // Controllers
    container.bind<RideController>(TYPES.RideController).to(RideController);
  }
}
