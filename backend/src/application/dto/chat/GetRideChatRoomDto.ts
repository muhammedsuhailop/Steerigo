import { z } from "zod";

const getRideChatRoomSchema = z.object({
  rideId: z.string().trim().min(1, "Ride ID is required"),
});

type GetRideChatRoomData = z.infer<typeof getRideChatRoomSchema>;

export class GetRideChatRoomDto {
  private readonly userId: string;
  private readonly data: GetRideChatRoomData;

  constructor(userId: string, requestData: unknown) {
    this.userId = userId;
    this.data = getRideChatRoomSchema.parse(requestData);
  }

  static fromRequest(userId: string, requestData: unknown): GetRideChatRoomDto {
    return new GetRideChatRoomDto(userId, requestData);
  }

  getUserId(): string {
    return this.userId;
  }

  getRideId(): string {
    return this.data.rideId;
  }
}

export { getRideChatRoomSchema };
