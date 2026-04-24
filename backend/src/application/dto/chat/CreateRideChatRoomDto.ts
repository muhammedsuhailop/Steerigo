import { z } from "zod";

const createRideChatRoomSchema = z.object({
  rideId: z.string().trim().min(1, "Ride ID is required"),
});

type CreateRideChatRoomData = z.infer<typeof createRideChatRoomSchema>;

export class CreateRideChatRoomDto {
  private readonly userId: string;
  private readonly data: CreateRideChatRoomData;

  constructor(userId: string, requestData: unknown) {
    this.userId = userId;
    this.data = createRideChatRoomSchema.parse(requestData);
  }

  static fromRequest(
    userId: string,
    requestData: unknown,
  ): CreateRideChatRoomDto {
    return new CreateRideChatRoomDto(userId, requestData);
  }

  getUserId(): string {
    return this.userId;
  }

  getRideId(): string {
    return this.data.rideId;
  }
}

export { createRideChatRoomSchema };
