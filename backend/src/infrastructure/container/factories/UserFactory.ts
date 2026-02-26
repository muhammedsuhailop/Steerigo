import { Container } from "inversify";
import { TYPES } from "@shared/constants/DITypes";

// User Use Cases
import { GetUserProfileUseCase } from "@application/use-cases/user/GetUserProfileUseCase";
import { UpdateUserProfileUseCase } from "@application/use-cases/user/UpdateUserProfileUseCase";
import { RegisterUserAsDriverUseCase } from "@application/use-cases/user/RegisterUserAsDriverUseCase";

// User Controllers
import { UserProfileController } from "@interface/controllers/user/UserProfileController";
import { FindNearbyDriversUseCase } from "@application/use-cases/user/FindNearbyDriversUseCase";
import { IUseCase } from "@application/use-cases/interfaces/IUseCase";
import {
  GetUserProfileDto,
  RegisterAsDriverRequestDto,
  RegisterAsDriverResponseDto,
  UpdateUserProfileDto,
  UserProfileUpdateResponseDto,
  UserResponseDto,
} from "@application/dto/user";
import { Result } from "@shared/utils/Result";
import { FindNearbyDriversRequestDto } from "@application/dto/user/FindNearbyDriversRequestDto";
import { FindNearbyDriversResponseDto } from "@application/dto/user/FindNearbyDriversResponseDto";
import { CancelRideRequestDto } from "@application/dto/user/CancelRideRequestDto";
import { CancelRideRequestResponseDto } from "@application/dto/user/CancelRideRequestResponseDto";
import { DomainError } from "@domain/errors/DomainError";
import { CancelRideRequestsUseCase } from "@application/use-cases/user/CancelRideRequestsUseCase";
import { GetUserRideByIdUseCase } from "@application/use-cases/user/GetUserRideByIdUseCase";

export class UserFactory {
  static register(container: Container): void {
    // Use case bindings
    container
      .bind<
        IUseCase<GetUserProfileDto, Promise<Result<UserResponseDto>>>
      >(TYPES.GetUserProfileUseCase)
      .to(GetUserProfileUseCase);

    container
      .bind<
        IUseCase<
          UpdateUserProfileDto,
          Promise<Result<UserProfileUpdateResponseDto>>
        >
      >(TYPES.UpdateUserProfileUseCase)
      .to(UpdateUserProfileUseCase);

    container
      .bind<
        IUseCase<
          RegisterAsDriverRequestDto,
          Promise<Result<RegisterAsDriverResponseDto>>
        >
      >(TYPES.RegisterUserAsDriverUseCase)
      .to(RegisterUserAsDriverUseCase);

    container
      .bind<
        IUseCase<
          FindNearbyDriversRequestDto,
          Promise<Result<FindNearbyDriversResponseDto>>
        >
      >(TYPES.FindNearbyDriversUseCase)
      .to(FindNearbyDriversUseCase);

    container
      .bind<
        IUseCase<
          CancelRideRequestDto,
          Promise<Result<CancelRideRequestResponseDto, DomainError>>
        >
      >(TYPES.CancelRideRequestsUseCase)
      .to(CancelRideRequestsUseCase);

    container
      .bind<GetUserRideByIdUseCase>(TYPES.GetUserRideByIdUseCase)
      .to(GetUserRideByIdUseCase);

    // Controller bindings
    container.bind(TYPES.UserProfileController).to(UserProfileController);
  }
}
