"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideRequestFactory = void 0;
const DITypes_1 = require("../../../shared/constants/DITypes");
const SendRideRequestUseCase_1 = require("../../../application/use-cases/user/SendRideRequestUseCase");
const RideController_1 = require("../../../interface/controllers/user/RideController");
class RideRequestFactory {
    static register(container) {
        // Use Cases
        container
            .bind(DITypes_1.TYPES.SendRideRequestUseCase)
            .to(SendRideRequestUseCase_1.SendRideRequestUseCase);
        // Controllers
        container.bind(DITypes_1.TYPES.RideController).to(RideController_1.RideController);
    }
}
exports.RideRequestFactory = RideRequestFactory;
//# sourceMappingURL=RideRequestFactory.js.map