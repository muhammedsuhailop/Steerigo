import { IRideNotificationService, DriverRequestNotificationPayload, DriverRequestCancelledPayload, RiderRideMatchedPayload, RiderNoDriverFoundPayload, RideArrivedPayload, RideStartedPayload, RideCompletedPayload, RideCancelledDriverPayload, RideCancelledRiderPayload, RideCancelledByDriverRiderPayload, RideCancelledByDriverDriverPayload, DriverFareUpdatedPayload, FutureRideAcceptedPayload, FutureRideAllDriversRejectedPayload } from "../../application/services/IRideNotificationService";
import { FutureRideRequestSentToDriverEvent } from "@application/events/FutureRideEvents";
export declare class RideNotificationService implements IRideNotificationService {
    private redisPublisher;
    private redisConnected;
    private tryGetSocketServer;
    private getRedisPublisher;
    private publishToRedis;
    notifyDriverNewRequest(driverId: string, payload: DriverRequestNotificationPayload): Promise<void>;
    notifyDriverRequestCancelled(driverId: string, payload: DriverRequestCancelledPayload): Promise<void>;
    notifyRiderRideMatched(riderId: string, payload: RiderRideMatchedPayload): Promise<void>;
    notifyRiderNoDriverFound(riderId: string, payload: RiderNoDriverFoundPayload): Promise<void>;
    notifyRiderRideArrived(riderId: string, payload: RideArrivedPayload): Promise<void>;
    notifyRiderRideStarted(riderId: string, payload: RideStartedPayload): Promise<void>;
    notifyRideCompleted(riderId: string, payload: RideCompletedPayload): Promise<void>;
    notifyRiderRideCancelled(riderId: string, payload: RideCancelledRiderPayload): Promise<void>;
    notifyDriverRideCancelled(driverId: string, payload: RideCancelledDriverPayload): Promise<void>;
    notifyRiderRideCancelledByDriver(riderId: string, payload: RideCancelledByDriverRiderPayload): Promise<void>;
    notifyDriverRideCancelledConfirmation(driverUserId: string, payload: RideCancelledByDriverDriverPayload): Promise<void>;
    notifyDriverFareUpdated(driverUserId: string, payload: DriverFareUpdatedPayload): Promise<void>;
    notifyRiderSearchProgress(riderId: string, payload: {
        requestGroupId: string;
        currentIndex: number;
        totalCandidates: number;
        message: string;
        status: "SEARCHING" | "COMPLETED" | "EXPIRED";
    }): Promise<void>;
    notifyDriverNewFutureRequest(driverUserId: string, payload: Omit<FutureRideRequestSentToDriverEvent["payload"], "driverId">): Promise<void>;
    notifyFutureRideAccepted(riderId: string, payload: FutureRideAcceptedPayload): Promise<void>;
    notifyFutureRideExpired(riderId: string, payload: {
        requestGroupId: string;
    }): Promise<void>;
    notifyDriverFutureRideExpired(driverUserId: string, payload: {
        futureRequestId: string;
        requestGroupId: string;
        driverId: string;
        riderId: string;
        pickupTime: string;
    }): Promise<void>;
    notifyDriverFutureRideRequestCancelled(driverUserId: string, payload: {
        futureRequestId: string;
        requestGroupId: string;
        driverId: string;
        acceptedByDriverId: string | null;
        cancelledByRider: boolean;
    }): Promise<void>;
    notifyDriverRideRequestExpired(driverUserId: string, payload: {
        requestId: string;
        driverId: string;
        requestGroupId: string;
        riderId: string;
        expiredAt: string;
    }): Promise<void>;
    notifyRiderFutureRideAllDriversRejected(riderId: string, payload: FutureRideAllDriversRejectedPayload): Promise<void>;
}
//# sourceMappingURL=RideNotificationService.d.ts.map