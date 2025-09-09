import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { RegisterDriverUseCase } from "@application/use-cases/driver/RegisterDriverUseCase";
import { RegisterDriverDto } from "@application/dto/driver/RegisterDriverDto";
import { validationResult } from "express-validator";

@injectable()
export class DriverController {
  constructor(
    @inject(RegisterDriverUseCase)
    private registerDriverUseCase: RegisterDriverUseCase
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const dto = new RegisterDriverDto(req.body);

    const userId = req.user?.userId;
    if (!userId) {
      res
        .status(401)
        .json({ success: false, message: "Unauthorized: Missing user ID" });
      return;
    }

    const result = await this.registerDriverUseCase.execute(dto, userId);

    if (result.isFailure()) {
      res
        .status(400)
        .json({ success: false, message: result.getError().message });
    } else {
      res
        .status(201)
        .json({ success: true, message: "Driver registered successfully" });
    }
  }
}
