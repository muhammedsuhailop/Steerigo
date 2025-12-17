import { z } from "zod";
import { AdminUserAction } from "@domain/value-objects/AdminAction";

interface UpdateUserStatusRequestBody {
  action:
    | typeof AdminUserAction.ACTIVATE
    | typeof AdminUserAction.DEACTIVATE
    | typeof AdminUserAction.SUSPEND
    | typeof AdminUserAction.DELETE;
  reason?: string;
}

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

  constructor(requestData: unknown) {
    this.data = updateUserStatusRequestSchema.parse(requestData);
  }

  static fromRequest(userId: string, requestBody: unknown) {
    const body = (requestBody ?? {}) as UpdateUserStatusRequestBody;
    return new UpdateUserStatusRequestDto({
      userId,
      action: body.action,
      reason: body.reason,
    });
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
