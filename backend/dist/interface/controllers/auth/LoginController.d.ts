import { Request, Response } from "express";
import { UserAuthController } from "./UserAuthController";
import { TokenController } from "./TokenController";
export declare class LoginController {
    private userAuthController;
    private tokenController;
    constructor(userAuthController: UserAuthController, tokenController: TokenController);
    login(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    refreshToken(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=LoginController.d.ts.map