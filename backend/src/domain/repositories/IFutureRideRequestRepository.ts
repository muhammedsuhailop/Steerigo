import { ICrudRepository } from "./ICrudRepository";

import { FutureRideRequest } from "@domain/entities/FutureRideRequest";

export interface IFutureRideRequestRepository
  extends ICrudRepository<FutureRideRequest> {}
