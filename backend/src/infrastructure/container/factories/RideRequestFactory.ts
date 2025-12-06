import { Container } from "inversify";
import { TYPES } from "@shared/constants/DITypes";
import { SendRideRequestUseCase } from "@application/use-cases/user/SendRideRequestUseCase";
import { RideController } from "@interface/controllers/user/RideController";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import { SendRideRequestDto } from "@application/dto/user/SendRideRequestDto";
import { SendRideRequestResponseDto } from "@application/dto/user/SendRideRequestResponseDto";
import { Result } from "@shared/utils/Result";

export class RideRequestFactory {
  static register(container: Container): void {
    // Use Cases
    container
      .bind<
        IUseCase<
          SendRideRequestDto,
          Promise<Result<SendRideRequestResponseDto>>
        >
      >(TYPES.SendRideRequestUseCase)
      .to(SendRideRequestUseCase);

    // Controllers
    container.bind<RideController>(TYPES.RideController).to(RideController);
  }
}
