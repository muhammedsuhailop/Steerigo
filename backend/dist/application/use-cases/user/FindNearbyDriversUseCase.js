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
exports.FindNearbyDriversUseCase = void 0;
const inversify_1 = require("inversify");
const FindNearbyDriversResponseDto_1 = require("../../dto/user/FindNearbyDriversResponseDto");
const Result_1 = require("../../../shared/utils/Result");
const DomainError_1 = require("../../../domain/errors/DomainError");
const Logger_1 = require("../../../shared/utils/Logger");
const DITypes_1 = require("../../../shared/constants/DITypes");
const SearchCriteria_1 = require("../../../domain/value-objects/SearchCriteria");
const DriverSearchFilter_1 = require("../../../domain/value-objects/DriverSearchFilter");
const AppConstants_1 = require("../../../shared/constants/AppConstants");
let FindNearbyDriversUseCase = class FindNearbyDriversUseCase {
    constructor(driverAvailabilityRepository, driverRepository, userRepository, fareCalculationService, availabilityCheckService) {
        this.driverAvailabilityRepository = driverAvailabilityRepository;
        this.driverRepository = driverRepository;
        this.userRepository = userRepository;
        this.fareCalculationService = fareCalculationService;
        this.availabilityCheckService = availabilityCheckService;
    }
    async execute(requestDto) {
        try {
            Logger_1.Logger.info("Find nearby drivers use case started", {
                latitude: requestDto.latitude,
                longitude: requestDto.longitude,
                searchDate: requestDto.searchDate,
                radiusKm: requestDto.radiusKm,
                timeRequired: requestDto.timeRequired,
                gearType: requestDto.gearType,
                bodyType: requestDto.bodyType,
            });
            requestDto.validate();
            const searchCriteria = SearchCriteria_1.SearchCriteria.create({ latitude: requestDto.latitude, longitude: requestDto.longitude }, requestDto.searchDate, requestDto.radiusKm, requestDto.timeRequired);
            const searchFilter = DriverSearchFilter_1.DriverSearchFilter.create(requestDto.gearType, requestDto.bodyType);
            const fareBreakdown = await this.fareCalculationService.calculateFare({
                durationMinutes: requestDto.timeRequired,
                searchDate: requestDto.searchDate,
            });
            const fetchLimit = requestDto.limit * AppConstants_1.AppConstants.FETCH_MULTIPLIER;
            const nearbyAvailabilities = await this.driverAvailabilityRepository.findNearbyAvailableDrivers(searchCriteria.getLatitude(), searchCriteria.getLongitude(), searchCriteria.getSearchDate(), searchCriteria.getRadiusKm(), searchCriteria.getTimeRequiredMinutes(), fetchLimit);
            Logger_1.Logger.debug("Get available drivers within radius result", {
                count: nearbyAvailabilities.length,
            });
            Logger_1.Logger.info("Found nearby driver availabilities", {
                count: nearbyAvailabilities.length,
            });
            if (nearbyAvailabilities.length === 0) {
                return Result_1.Result.success(FindNearbyDriversResponseDto_1.FindNearbyDriversResponseDto.create([], 0, {
                    location: {
                        latitude: searchCriteria.getLatitude(),
                        longitude: searchCriteria.getLongitude(),
                    },
                    radiusKm: searchCriteria.getRadiusKm(),
                    searchDate: searchCriteria.getSearchDate(),
                    timeRequiredMinutes: searchCriteria.getTimeRequiredMinutes(),
                    filters: searchFilter.hasFilters()
                        ? {
                            gearType: searchFilter.getGearType(),
                            bodyType: searchFilter.getBodyType(),
                        }
                        : undefined,
                }, fareBreakdown));
            }
            Logger_1.Logger.info("Fare calculated for driver search", {
                durationMinutes: requestDto.timeRequired,
                totalFare: fareBreakdown.getTotalFare().getAmount(),
            });
            const driverResponses = await Promise.all(nearbyAvailabilities.map(async (availabilityWithDistance) => {
                const availability = availabilityWithDistance.driver;
                const driverId = availability.getDriverId();
                const availabilityId = availability.getId();
                Logger_1.Logger.debug("Processing driver candidate", {
                    driverId,
                    availabilityId,
                    distanceKm: availabilityWithDistance.distanceKm,
                    etaMinutes: availabilityWithDistance.etaMinutes,
                });
                try {
                    const startDate = searchCriteria.getSearchDate();
                    const endDate = new Date(startDate.getTime() +
                        searchCriteria.getTimeRequiredMinutes() * 60 * 1000);
                    const isAvailable = await this.availabilityCheckService.isAvailableDuring(driverId, startDate, endDate);
                    if (!isAvailable) {
                        const schedule = availability.getRecurringSchedule();
                        Logger_1.Logger.info("Driver filtered out - insufficient availability window", {
                            driverId,
                            availabilityId,
                            availableFrom: schedule?.validity.startDate ?? "unknown",
                            availableTill: schedule?.validity.endDate ?? "unknown",
                            searchDate: searchCriteria.getSearchDate(),
                            requiredMinutes: searchCriteria.getTimeRequiredMinutes(),
                        });
                        return null;
                    }
                    const driver = await this.driverRepository.findById(driverId);
                    if (!driver) {
                        Logger_1.Logger.warn("Driver filtered out - driver profile not found", {
                            driverId,
                            availabilityId,
                        });
                        return null;
                    }
                    if (driver.getStatus() !== "Active") {
                        Logger_1.Logger.info("Driver filtered out - status not Active", {
                            driverId,
                            status: driver.getStatus(),
                        });
                        return null;
                    }
                    if (searchFilter.hasFilters()) {
                        const matches = searchFilter.matches(driver.getEligibleGearTypes(), driver.getEligibleBodyTypes(), 0);
                        if (!matches) {
                            Logger_1.Logger.info("Driver filtered out - filter mismatch", {
                                driverId,
                                requiredGearType: searchFilter.getGearType(),
                                requiredBodyType: searchFilter.getBodyType(),
                                driverGearTypes: driver.getEligibleGearTypes(),
                                driverBodyTypes: driver.getEligibleBodyTypes(),
                            });
                            return null;
                        }
                    }
                    const user = await this.userRepository.findById(driver.getUserId());
                    if (!user) {
                        Logger_1.Logger.warn("Driver filtered out - linked user not found", {
                            driverId,
                            userId: driver.getUserId(),
                        });
                        return null;
                    }
                    const location = availability.getCurrentLocation();
                    const coordinates = location.getCoordinates();
                    const response = {
                        id: driver.getId(),
                        userId: user.getId(),
                        name: user.getName(),
                        mobile: user.getMobile() ?? "",
                        profilePicture: user.getProfilePicture(),
                        rating: 4.5,
                        totalRides: 50,
                        status: driver.getStatus(),
                        gearType: driver.getEligibleGearTypes()[0] ?? "",
                        bodyType: driver.getEligibleBodyTypes()[0] ?? "",
                        distance: {
                            value: availabilityWithDistance.distanceKm,
                            unit: "km",
                        },
                        eta: {
                            value: availabilityWithDistance.etaMinutes,
                            unit: "minutes",
                        },
                        currentLocation: {
                            latitude: coordinates.latitude,
                            longitude: coordinates.longitude,
                            address: coordinates.address,
                        },
                        availabilityStatus: availability.getStatus(),
                    };
                    Logger_1.Logger.debug("Driver passed all checks and added to results", {
                        driverId,
                        userId: user.getId(),
                        distanceKm: availabilityWithDistance.distanceKm,
                        etaMinutes: availabilityWithDistance.etaMinutes,
                    });
                    return response;
                }
                catch (error) {
                    Logger_1.Logger.error("Error processing driver in search", {
                        driverId,
                        availabilityId,
                        error,
                    });
                    return null;
                }
            }));
            const validDrivers = driverResponses
                .filter((driver) => driver !== null)
                .slice(0, requestDto.limit);
            Logger_1.Logger.info("Filtered drivers after applying criteria", {
                total: nearbyAvailabilities.length,
                matched: validDrivers.length,
            });
            const responseDto = FindNearbyDriversResponseDto_1.FindNearbyDriversResponseDto.create(validDrivers, validDrivers.length, {
                location: {
                    latitude: searchCriteria.getLatitude(),
                    longitude: searchCriteria.getLongitude(),
                },
                radiusKm: searchCriteria.getRadiusKm(),
                searchDate: searchCriteria.getSearchDate(),
                timeRequiredMinutes: searchCriteria.getTimeRequiredMinutes(),
                filters: searchFilter.hasFilters()
                    ? {
                        gearType: searchFilter.getGearType(),
                        bodyType: searchFilter.getBodyType(),
                    }
                    : undefined,
            }, fareBreakdown);
            Logger_1.Logger.info("Find nearby drivers use case completed successfully", {
                driversFound: validDrivers.length,
            });
            return Result_1.Result.success(responseDto);
        }
        catch (error) {
            if (error instanceof DomainError_1.DomainError) {
                Logger_1.Logger.warn("Find nearby drivers validation failed", {
                    errorName: error.constructor.name,
                    message: error.message,
                });
                return Result_1.Result.failure(error);
            }
            Logger_1.Logger.error("Find nearby drivers use case failed", { error });
            return Result_1.Result.failure(error);
        }
    }
};
exports.FindNearbyDriversUseCase = FindNearbyDriversUseCase;
exports.FindNearbyDriversUseCase = FindNearbyDriversUseCase = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(DITypes_1.TYPES.DriverAvailabilityRepository)),
    __param(1, (0, inversify_1.inject)(DITypes_1.TYPES.DriverRepository)),
    __param(2, (0, inversify_1.inject)(DITypes_1.TYPES.UserRepository)),
    __param(3, (0, inversify_1.inject)(DITypes_1.TYPES.FareCalculationService)),
    __param(4, (0, inversify_1.inject)(DITypes_1.TYPES.AvailabilityCheckService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], FindNearbyDriversUseCase);
//# sourceMappingURL=FindNearbyDriversUseCase.js.map