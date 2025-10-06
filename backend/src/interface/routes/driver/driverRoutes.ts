// import { Router } from "express";
// import { container } from "@infrastructure/container/Container";
// import { DriverController } from "../../controllers/driver/DriverController";
// import { registerDriverValidation } from "../../validators/driver/driverValidators";
// import { authMiddleware } from "../../middleware/auth/AuthMiddleware";
// import { requireRoles } from "../../middleware/auth/RoleMiddleware";

// const router = Router();
// const driverController = container.get<DriverController>(DriverController);

// // POST /api/driver/register - Driver Registration
// router.post(
//   "/register",
//   authMiddleware,
//   requireRoles("Driver"),
//   registerDriverValidation,
//   driverController.register.bind(driverController)
// );

// export { router as driverRoutes };
