// import { Router, Request, Response } from "express";
// import { container } from "@infrastructure/container/Container";
// import { UserProfileController } from "../../controllers/user/UserProfileController";
// import {
//   getUserProfileValidation,
//   updateUserProfileValidation,
// } from "../../validators/user/userProfileValidators";
// import { authMiddleware } from "../../middleware/auth/AuthMiddleware";

// const router = Router();

// const userProfileController = container.resolve(UserProfileController);

// router.use(authMiddleware);

// // GET /api/user/profile/:userId
// router.get(
//   "/:userId",
//   getUserProfileValidation,
//   (req: Request, res: Response) =>
//     userProfileController.getUserProfile(req, res)
// );

// // PUT /api/user/profile/:userId
// router.put(
//   "/:userId",
//   updateUserProfileValidation,
//   (req: Request, res: Response) =>
//     userProfileController.updateUserProfile(req, res)
// );

// export { router as userProfileRoutes };
