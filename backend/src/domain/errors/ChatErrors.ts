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

  static messageNotFound(messageId: string): DomainError {
    return new DomainError(
      `Message not found for messageId: ${messageId}`,
      "MESSAGE_NOT_FOUND",
      {
        statusCode: HttpStatusCodes.NOT_FOUND,
        errorType: ErrorType.NOT_FOUND_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "NOT_FOUND",
      },
    );
  }

  static unauthorizedMessageAccess(
    messageId: string,
    userId: string,
  ): DomainError {
    return new DomainError(
      `User ${userId} is not allowed to access message ${messageId}`,
      "UNAUTHORIZED_MESSAGE_ACCESS",
      {
        statusCode: HttpStatusCodes.FORBIDDEN,
        errorType: ErrorType.AUTHORIZATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "AUTH",
      },
    );
  }

  static cannotEditOthersMessage(
    messageId: string,
    userId: string,
  ): DomainError {
    return new DomainError(
      `User ${userId} cannot edit message ${messageId} because it belongs to another user`,
      "CANNOT_EDIT_OTHERS_MESSAGE",
      {
        statusCode: HttpStatusCodes.FORBIDDEN,
        errorType: ErrorType.AUTHORIZATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "AUTH",
      },
    );
  }

  static cannotDeleteOthersMessage(
    messageId: string,
    userId: string,
  ): DomainError {
    return new DomainError(
      `User ${userId} cannot delete message ${messageId} because it belongs to another user`,
      "CANNOT_DELETE_OTHERS_MESSAGE",
      {
        statusCode: HttpStatusCodes.FORBIDDEN,
        errorType: ErrorType.AUTHORIZATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "AUTH",
      },
    );
  }

  static messageAlreadyDeleted(messageId: string): DomainError {
    return new DomainError(
      `Message ${messageId} is already deleted`,
      "MESSAGE_ALREADY_DELETED",
      {
        statusCode: HttpStatusCodes.CONFLICT,
        errorType: ErrorType.CONFLICT_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "CONFLICT",
      },
    );
  }

  static cannotEditDeletedMessage(messageId: string): DomainError {
    return new DomainError(
      `Message ${messageId} is deleted and cannot be edited`,
      "CANNOT_EDIT_DELETED_MESSAGE",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static messageEditWindowExpired(messageId: string): DomainError {
    return new DomainError(
      `Message ${messageId} can no longer be edited because the edit window has expired`,
      "MESSAGE_EDIT_WINDOW_EXPIRED",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static invalidMessageTypeForEdit(
    messageId: string,
    type: string,
  ): DomainError {
    return new DomainError(
      `Message ${messageId} of type ${type} cannot be edited`,
      "INVALID_MESSAGE_TYPE_FOR_EDIT",
      {
        statusCode: HttpStatusCodes.BAD_REQUEST,
        errorType: ErrorType.VALIDATION_ERROR,
        shouldLog: false,
        isOperational: true,
        category: "VALIDATION",
      },
    );
  }

  static invalidMessageOperation(
    messageId: string,
    operation: "edit" | "delete",
  ): DomainError {
    return new DomainError(
      `Cannot ${operation} message ${messageId} due to its current state`,
      "INVALID_MESSAGE_OPERATION",
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
