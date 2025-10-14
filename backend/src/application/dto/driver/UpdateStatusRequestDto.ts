import { z } from "zod";
import {
  AvailabilityStatus,
  VALID_AVAILABILITY_STATUSES,
} from "@domain/value-objects/AvailabilityStatus";

const updateStatusSchema = z.object({
  status: z.enum(VALID_AVAILABILITY_STATUSES as [string, ...string[]], {
    message: `Status must be one of: ${VALID_AVAILABILITY_STATUSES.join(", ")}`,
  }),
});

type UpdateStatusData = z.infer<typeof updateStatusSchema>;

export class UpdateStatusRequestDto {
  private readonly data: UpdateStatusData;
  private readonly driverId: string;

  constructor(requestData: any) {
    this.data = updateStatusSchema.parse(requestData);
    this.driverId = requestData.driverId;
  }

  getStatus(): AvailabilityStatus {
    return this.data.status as AvailabilityStatus;
  }

  getDriverId(): string {
    return this.driverId;
  }
}
