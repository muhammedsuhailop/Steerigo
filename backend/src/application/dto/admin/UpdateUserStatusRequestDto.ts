import { z } from "zod";
import { AdminUserAction } from "@domain/value-objects/AdminAction";

const updateUserStatusRequestSchema = z.object({
  userId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId format"),
  action: z.enum([
    AdminUserAction.ACTIVATE,
    AdminUserAction.DEACTIVATE,
    AdminUserAction.SUSPEND,
    AdminUserAction.DELETE,
  ]),
  reason: z.string().min(3).max(500).optional(),
});

type UpdateUserStatusRequestData = z.infer<
  typeof updateUserStatusRequestSchema
>;

export class UpdateUserStatusRequestDto {
  private readonly data: UpdateUserStatusRequestData;

  constructor(requestData: any) {
    this.data = updateUserStatusRequestSchema.parse(requestData);
  }

  getUserId(): string {
    return this.data.userId;
  }

  getAction(): AdminUserAction {
    return this.data.action;
  }

  getReason(): string | undefined {
    return this.data.reason;
  }
}
