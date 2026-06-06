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
exports.GetAdminRatingsUseCase = void 0;
const inversify_1 = require("inversify");
const Result_1 = require("../../../shared/utils/Result");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
let GetAdminRatingsUseCase = class GetAdminRatingsUseCase {
    constructor(ratingRepository) {
        this.ratingRepository = ratingRepository;
    }
    async execute(dto) {
        try {
            Logger_1.Logger.info("Admin get ratings requested", {
                page: dto.getPage(),
                limit: dto.getLimit(),
                sortBy: dto.getSortBy(),
                sortOrder: dto.getSortOrder(),
                reviewType: dto.getReviewType(),
                revieweeId: dto.getRevieweeId(),
            });
            const result = await this.ratingRepository.findAll({
                filters: {
                    reviewType: dto.getReviewType(),
                    reviewerId: dto.getReviewerId(),
                    revieweeId: dto.getRevieweeId(),
                    rideId: dto.getRideId(),
                    minRating: dto.getMinRating(),
                    maxRating: dto.getMaxRating(),
                    fromDate: dto.getFromDate(),
                    toDate: dto.getToDate(),
                },
                sortBy: dto.getSortBy(),
                sortOrder: dto.getSortOrder(),
                page: dto.getPage(),
                limit: dto.getLimit(),
            });
            const ratings = result.ratings.map((rating) => ({
                ratingId: rating.getId(),
                rideId: rating.getRideId(),
                reviewerId: rating.getReviewerId(),
                reviewerName: rating.getReviewerName(),
                revieweeId: rating.getRevieweeId(),
                reviewType: rating.getReviewType(),
                criteria: rating.getCriteria().toObject(),
                overallRating: rating.getOverallRating(),
                review: rating.getReview(),
                createdAt: rating.getCreatedAt().toISOString(),
                updatedAt: rating.getUpdatedAt().toISOString(),
            }));
            Logger_1.Logger.info("Admin ratings fetched successfully", {
                total: result.total,
                page: result.page,
                totalPages: result.totalPages,
            });
            return Result_1.Result.success({
                ratings,
                pagination: {
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    totalPages: result.totalPages,
                },
            });
        }
        catch (error) {
            Logger_1.Logger.error("Error fetching admin ratings", {
                error: error instanceof Error ? error.message : String(error),
            });
            return Result_1.Result.failure(error);
        }
    }
};
exports.GetAdminRatingsUseCase = GetAdminRatingsUseCase;
exports.GetAdminRatingsUseCase = GetAdminRatingsUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.RatingRepository)),
    __metadata("design:paramtypes", [Object])
], GetAdminRatingsUseCase);
//# sourceMappingURL=GetAdminRatingsUseCase.js.map