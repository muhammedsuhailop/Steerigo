"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateDriverUseCase = void 0;
const inversify_1 = require("inversify");
const DITypes_1 = require("@shared/constants/DITypes");
const Result_1 = require("@shared/utils/Result");
const DomainError_1 = require("@domain/errors/DomainError");
const Logger_1 = require("@shared/utils/Logger");
const RideErrors_1 = require("@domain/errors/RideErrors");
const Rating_1 = require("@domain/entities/Rating");
const UserNotFoundError_1 = require("@domain/errors/UserNotFoundError");
let RateDriverUseCase = class RateDriverUseCase {
    constructor(rideRepository, driverRepository, ratingRepository, userRepository, idGenerator, unitOfWork) {
        this.rideRepository = rideRepository;
        this.driverRepository = driverRepository;
        this.ratingRepository = ratingRepository;
        this.userRepository = userRepository;
        this.idGenerator = idGenerator;
        this.unitOfWork = unitOfWork;
    }
    async execute(dto) {
        const riderId = dto.getRiderId();
        const rideId = dto.rideId;
        try {
            Logger_1.Logger.info("Rate driver requested", { riderId, rideId });
            const ride = await this.rideRepository.findByRideId(rideId);
            if (!ride)
                return Result_1.Result.failure(RideErrors_1.RideErrors.rideNotFound(rideId));
            if (ride.getRiderId() !== riderId) {
                return Result_1.Result.failure(RideErrors_1.RideErrors.unauthorizedRideAccess(rideId));
            }
            if (!ride.isCompleted()) {
                return Result_1.Result.failure(RideErrors_1.RideErrors.cannotRateIncompleteRide(rideId));
            }
            const driverId = ride.getDriverId();
            if (!driverId)
                return Result_1.Result.failure(RideErrors_1.RideErrors.driverNotFoundForRide(rideId));
            const alreadyExists = await this.ratingRepository.existsByRideAndReviewer(rideId, riderId);
            if (alreadyExists)
                return Result_1.Result.failure(RideErrors_1.RideErrors.rideAlreadyRated(rideId));
            const driver = await this.driverRepository.findById(driverId);
            if (!driver)
                return Result_1.Result.failure(RideErrors_1.RideErrors.driverNotFoundForRide(rideId));
            const riderUser = await this.userRepository.findById(riderId);
            if (!riderUser)
                return Result_1.Result.failure(new UserNotFoundError_1.UserNotFoundError());
            const criteria = dto.getCriteria();
            const overallRating = criteria.getAverage();
            const ratingId = this.idGenerator.generate();
            const rating = Rating_1.Rating.create({
                id: ratingId,
                rideId,
                reviewerId: riderId,
                reviewerName: riderUser.getName(),
                revieweeId: driverId,
                reviewType: dto.reviewType,
                criteria,
                review: dto.review,
            });
            driver.updateRating(overallRating);
            const resultData = await this.unitOfWork.runInTransaction(async () => {
                await this.ratingRepository.save(rating);
                await this.driverRepository.save(driver);
                return {
                    rideId,
                    driverId,
                    ratingId,
                    overallRating,
                    driver: {
                        driverId,
                        averageRating: driver.getAverageRating(),
                        numberOfRatings: driver.getNumberOfRatings(),
                    },
                };
            });
            Logger_1.Logger.info("Driver rated successfully", {
                riderId,
                rideId,
                overallRating,
            });
            return Result_1.Result.success(resultData);
        }
        catch (error) {
            Logger_1.Logger.error("Unexpected error processing driver rating", {
                riderId,
                rideId,
                error: error instanceof Error ? error.message : String(error),
            });
            if (error instanceof DomainError_1.DomainError)
                return Result_1.Result.failure(error);
            return Result_1.Result.failure(RideErrors_1.RideErrors.invalidRatingData("Database synchronization failed"));
        }
    }
};
exports.RateDriverUseCase = RateDriverUseCase;
exports.RateDriverUseCase = RateDriverUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.RideRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.RatingRepository)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.UserRepository)),
    __param(4, (0, inversify_1.inject)(DITypes_1.TYPES.IDGenerator)),
    __param(5, (0, inversify_1.inject)(DITypes_1.TYPES.UnitOfWork)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
], RateDriverUseCase);
//# sourceMappingURL=RateDriverUseCase.js.map