import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { UserAuthController } from "./UserAuthController";
import { TokenController } from "./TokenController";
import { TYPES } from "@shared/constants/DITypes";

@injectable()
export class LoginController {
  constructor(
    @inject(TYPES.UserAuthController)
    private userAuthController: UserAuthController,
    @inject(TYPES.TokenController) private tokenController: TokenController
  ) {}

  async login(req: Request, res: Response): Promise<void> {
    return this.userAuthController.login(req, res);
  }

  async logout(req: Request, res: Response): Promise<void> {
    return this.tokenController.logout(req, res);
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    return this.tokenController.refreshToken(req, res);
  }
}
