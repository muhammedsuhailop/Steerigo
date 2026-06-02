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
exports.AutoSearchAndSendRideRequestUseCase = void 0;
const inversify_1 = require("inversify");
const DITypes_1 = require("@shared/constants/DITypes");
const AutoSearchAndRequestResponseDto_1 = require("@application/dto/user/AutoSearchAndRequestResponseDto");
const Result_1 = require("@shared/utils/Result");
const DomainError_1 = require("@domain/errors/DomainError");
const Logger_1 = require("@shared/utils/Logger");
const SearchCriteria_1 = require("@domain/value-objects/SearchCriteria");
const RideRequestErrors_1 = require("@domain/errors/RideRequestErrors");
const AppConstants_1 = require("@shared/constants/AppConstants");
const RideRequestGroup_1 = require("@domain/entities/RideRequestGroup");
const Location_1 = require("@domain/value-objects/Location");
let AutoSearchAndSendRideRequestUseCase = class AutoSearchAndSendRideRequestUseCase {
    constructor(driverAvailabilityRepository, userRepository, fareCalculationService, rideRequestGroupRepository, rideSearchDispatchService) {
        this.driverAvailabilityRepository = driverAvailabilityRepository;
        this.userRepository = userRepository;
        this.fareCalculationService = fareCalculationService;
        this.rideRequestGroupRepository = rideRequestGroupRepository;
        this.rideSearchDispatchService = rideSearchDispatchService;
    }
    async execute(dto) {
        const userId = dto.getRiderId();
        try {
            dto.validate();
            const rider = await this.userRepository.findById(userId);
            if (!rider) {
                return Result_1.Result.failure(RideRequestErrors_1.RideRequestErrors.userNotFound(userId));
            }
            const fareBreakdown = await this.fareCalculationService.calculateFare({
                durationMinutes: dto.timeRequired * 60,
                searchDate: dto.searchDate,
            });
            const searchCriteria = SearchCriteria_1.SearchCriteria.create({ latitude: dto.latitude, longitude: dto.longitude }, dto.searchDate, dto.radiusKm, dto.timeRequired);
            const fetchLimit = dto.maxRideRequests * AppConstants_1.AppConstants.FETCH_MULTIPLIER;
            const nearbyAvailabilities = await this.driverAvailabilityRepository.findNearbyAvailableDrivers(searchCriteria.getLatitude(), searchCriteria.getLongitude(), searchCriteria.getSearchDate(), searchCriteria.getRadiusKm(), searchCriteria.getTimeRequiredMinutes(), fetchLimit);
            const pickup = Location_1.Location.create({
                latitude: dto.latitude,
                longitude: dto.longitude,
                address: dto.pickupAddress,
            });
            const drop = Location_1.Location.create({
                latitude: dto.dropLatitude,
                longitude: dto.dropLongitude,
                address: dto.dropAddress,
            });
            const candidateDriverIds = nearbyAvailabilities.map((item) => item.driver.getDriverId());
            if (candidateDriverIds.length === 0) {
                Logger_1.Logger.info("No nearby candidate drivers found for search session", {
                    riderId: userId,
                    requestGroupId: dto.requestGroupId,
                });
                return Result_1.Result.success(AutoSearchAndRequestResponseDto_1.AutoSearchAndRequestResponseDto.create(dto.requestGroupId, [], [], 0));
            }
            const rideRequestGroup = RideRequestGroup_1.RideRequestGroup.create(dto.requestGroupId, userId, pickup, drop, dto.timeRequired, dto.rideType, fareBreakdown, candidateDriverIds);
            const savedGroup = await this.rideRequestGroupRepository.save(rideRequestGroup);
            Logger_1.Logger.info("Ride search group created", {
                requestGroupId: savedGroup.getId(),
                riderId: savedGroup.getRiderId(),
                candidateCount: savedGroup.getCandidateDriverIds().length,
                candidateDriverIds: savedGroup.getCandidateDriverIds(),
            });
            await this.rideSearchDispatchService.scheduleGroupGuards(savedGroup.getId());
            await this.rideSearchDispatchService.dispatchNextRequest(savedGroup.getId(), 0);
            return Result_1.Result.success(AutoSearchAndRequestResponseDto_1.AutoSearchAndRequestResponseDto.create(savedGroup.getId(), [], [], nearbyAvailabilities.length));
        }
        catch (error) {
            Logger_1.Logger.error("Auto search failed", { error });
            if (error instanceof DomainError_1.DomainError) {
                return Result_1.Result.failure(error);
            }
            return Result_1.Result.failure(RideRequestErrors_1.RideRequestErrors.rideRequestCreationFailed(error instanceof Error ? error.message : "Unknown error"));
        }
    }
};
exports.AutoSearchAndSendRideRequestUseCase = AutoSearchAndSendRideRequestUseCase;
exports.AutoSearchAndSendRideRequestUseCase = AutoSearchAndSendRideRequestUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.DriverAvailabilityRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.UserRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.FareCalculationService)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.RideRequestGroupRepository)),
    __param(4, (0, inversify_1.inject)(DITypes_1.TYPES.RideSearchDispatchService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], AutoSearchAndSendRideRequestUseCase);
//# sourceMappingURL=AutoSearchAndSendRideRequestUseCase.js.map