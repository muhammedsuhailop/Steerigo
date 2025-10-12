import { Container } from "inversify";
import { TYPES } from "@shared/constants/DITypes";

// User Use Cases
import { GetUserProfileUseCase } from "@application/use-cases/user/GetUserProfileUseCase";
import { UpdateUserProfileUseCase } from "@application/use-cases/user/UpdateUserProfileUseCase";
import { RegisterUserAsDriverUseCase } from "@application/use-cases/user/RegisterUserAsDriverUseCase";

// User Controllers
import { UserProfileController } from "@interface/controllers/user/UserProfileController";

export class UserFactory {
  static register(container: Container): void {
    // Use case bindings
    container.bind(TYPES.GetUserProfileUseCase).to(GetUserProfileUseCase);

    container.bind(TYPES.UpdateUserProfileUseCase).to(UpdateUserProfileUseCase);

    container
      .bind(TYPES.RegisterUserAsDriverUseCase)
      .to(RegisterUserAsDriverUseCase);

    // Controller bindings
    container.bind(TYPES.UserProfileController).to(UserProfileController);
  }
}
