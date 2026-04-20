import { DomainError } from "./DomainError";
import { ErrorType } from "@shared/enums/ErrorType";
import { HttpStatusCodes } from "@shared/enums/HttpStatusCodes";

export class ChatErrors {
  static rideNotFound(rideId: string): DomainError {
    return new DomainError(
      `Ride not found for rideId: ${rideId}`,
      "RIDE_NOT_FOUND",
      {
        statusCode: HttpStatusCodes.NOT_FOUND,
        errorType: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "NOT_FOUND",
      },
    );
  }

  static chatRoomNotFoundByRide(rideId: string): DomainError {
    return new DomainError(
      `Chat room not found for rideId: ${rideId}`,
      "CHAT_ROOM_NOT_FOUND_BY_RIDE",
      {
        statusCode: HttpStatusCodes.NOT_FOUND,
        errorType: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "NOT_FOUND",
      },
    );
  }

  static chatRoomNotFound(chatRoomId: string): DomainError {
    return new DomainError(
      `Chat room not found for chatRoomId: ${chatRoomId}`,
      "CHAT_ROOM_NOT_FOUND",
      {
        statusCode: HttpStatusCodes.NOT_FOUND,
        errorType: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "NOT_FOUND",
      },
    );
  }

  static unauthorizedChatAccess(
    chatRoomId: string,
    userId: string,
  ): DomainError {
    return new DomainError(
      `User ${userId} is not a participant of chat room ${chatRoomId}`,
      "UNAUTHORIZED_CHAT_ACCESS",
      {
        statusCode: HttpStatusCodes.FORBIDDEN,
        errorType: ErrorType.AUTHORIZATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "AUTH",
      },
    );
  }

  static unauthorizedRideChatAccess(
    rideId: string,
    userId: string,
  ): DomainError {
    return new DomainError(
      `User ${userId} is not allowed to access chat for ride ${rideId}`,
      "UNAUTHORIZED_RIDE_CHAT_ACCESS",
      {
        statusCode: HttpStatusCodes.FORBIDDEN,
        errorType: ErrorType.AUTHORIZATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "AUTH",
      },
    );
  }

  static rideNotEligibleForChat(rideId: string, status: string): DomainError {
    return new DomainError(
      `Ride ${rideId} is not eligible for chat in status ${status}`,
      "RIDE_NOT_ELIGIBLE_FOR_CHAT",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static chatRoomAlreadyExists(rideId: string): DomainError {
    return new DomainError(
      `Chat room already exists for ride ${rideId}`,
      "CHAT_ROOM_ALREADY_EXISTS",
      {
        statusCode: HttpStatusCodes.CONFLICT,
        errorType: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "CONFLICT",
      },
    );
  }

  static chatRoomEnded(chatRoomId: string): DomainError {
    return new DomainError(
      `Chat room ${chatRoomId} has ended`,
      "CHAT_ROOM_ENDED",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static invalidMessageContent(): DomainError {
    return new DomainError(
      "Message content is required",
      "INVALID_MESSAGE_CONTENT",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }
}
