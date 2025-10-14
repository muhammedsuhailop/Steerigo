import { DomainError } from "./DomainError";
export class DriverNotFoundError extends DomainError {
  constructor(driverId?: string) {
    super(`Driver not found${driverId ? ` with ID: ${driverId}` : ""}`);
  }
}
