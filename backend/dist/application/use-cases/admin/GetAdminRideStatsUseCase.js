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
exports.GetAdminRideStatsUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("@shared/utils/Result");
const DITypes_1 = require("@shared/constants/DITypes");
let GetAdminRideStatsUseCase = class GetAdminRideStatsUseCase {
    constructor(rideRepository, ratingRepository) {
        this.rideRepository = rideRepository;
        this.ratingRepository = ratingRepository;
    }
    async execute(dto) {
        try {
            const now = new Date();
            let fromDate = dto.getFromDate();
            let toDate = dto.getToDate();
            if (!fromDate || !toDate) {
                toDate = now;
                fromDate = new Date();
                fromDate.setDate(now.getDate() - 7); // default last 7 days
            }
            const dateFilters = { fromDate, toDate };
            const [rideStats, ratingStats] = await Promise.all([
                this.rideRepository.countRideStats({
                    filters: dateFilters,
                }),
                this.ratingRepository.getRatingStats({
                    filters: dateFilters,
                }),
            ]);
            return Result_1.Result.success({
                fromDate: fromDate.toISOString(),
                toDate: toDate.toISOString(),
                rideStats: {
                    totalRides: rideStats.total,
                    completedRides: rideStats.completed,
                    cancelledRides: rideStats.cancelled,
                    totalAmount: rideStats.totalAmount,
                    currency: "INR",
                },
                ratingStats: {
                    averageRating: ratingStats.averageRating,
                    totalRatings: ratingStats.totalRatings,
                    distribution: {
                        zeroToOne: ratingStats.distribution.zeroToOne,
                        oneToTwo: ratingStats.distribution.oneToTwo,
                        twoToThree: ratingStats.distribution.twoToThree,
                        threeToFour: ratingStats.distribution.threeToFour,
                        fourToFive: ratingStats.distribution.fourToFive,
                    },
                },
            });
        }
        catch (error) {
            return Result_1.Result.failure(error);
        }
    }
};
exports.GetAdminRideStatsUseCase = GetAdminRideStatsUseCase;
exports.GetAdminRideStatsUseCase = GetAdminRideStatsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.RideRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.RatingRepository)),
    __metadata("design:paramtypes", [Object, Object])
], GetAdminRideStatsUseCase);
//# sourceMappingURL=GetAdminRideStatsUseCase.js.map