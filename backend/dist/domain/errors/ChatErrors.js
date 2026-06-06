"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatErrors = void 0;
const DomainError_1 = require("./DomainError");
const ErrorType_1 = require("../../shared/enums/ErrorType");
const HttpStatusCodes_1 = require("../../shared/enums/HttpStatusCodes");
class ChatErrors {
    static rideNotFound(rideId) {
        return new DomainError_1.DomainError(`Ride not found for rideId: ${rideId}`, "RIDE_NOT_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
    }
    static chatRoomNotFoundByRide(rideId) {
        return new DomainError_1.DomainError(`Chat room not found for rideId: ${rideId}`, "CHAT_ROOM_NOT_FOUND_BY_RIDE", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
    }
    static chatRoomNotFound(chatRoomId) {
        return new DomainError_1.DomainError(`Chat room not found for chatRoomId: ${chatRoomId}`, "CHAT_ROOM_NOT_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
    }
    static unauthorizedChatAccess(chatRoomId, userId) {
        return new DomainError_1.DomainError(`User ${userId} is not a participant of chat room ${chatRoomId}`, "UNAUTHORIZED_CHAT_ACCESS", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.FORBIDDEN,
            errorType: ErrorType_1.ErrorType.AUTHORIZATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "AUTH",
        });
    }
    static unauthorizedRideChatAccess(rideId, userId) {
        return new DomainError_1.DomainError(`User ${userId} is not allowed to access chat for ride ${rideId}`, "UNAUTHORIZED_RIDE_CHAT_ACCESS", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.FORBIDDEN,
            errorType: ErrorType_1.ErrorType.AUTHORIZATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "AUTH",
        });
    }
    static rideNotEligibleForChat(rideId, status) {
        return new DomainError_1.DomainError(`Ride ${rideId} is not eligible for chat in status ${status}`, "RIDE_NOT_ELIGIBLE_FOR_CHAT", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static chatRoomAlreadyExists(rideId) {
        return new DomainError_1.DomainError(`Chat room already exists for ride ${rideId}`, "CHAT_ROOM_ALREADY_EXISTS", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
            errorType: ErrorType_1.ErrorType.CONFLICT_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "CONFLICT",
        });
    }
    static chatRoomEnded(chatRoomId) {
        return new DomainError_1.DomainError(`Chat room ${chatRoomId} has ended`, "CHAT_ROOM_ENDED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static invalidMessageContent() {
        return new DomainError_1.DomainError("Message content is required", "INVALID_MESSAGE_CONTENT", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static messageNotFound(messageId) {
        return new DomainError_1.DomainError(`Message not found for messageId: ${messageId}`, "MESSAGE_NOT_FOUND", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.NOT_FOUND,
            errorType: ErrorType_1.ErrorType.NOT_FOUND_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "NOT_FOUND",
        });
    }
    static unauthorizedMessageAccess(messageId, userId) {
        return new DomainError_1.DomainError(`User ${userId} is not allowed to access message ${messageId}`, "UNAUTHORIZED_MESSAGE_ACCESS", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.FORBIDDEN,
            errorType: ErrorType_1.ErrorType.AUTHORIZATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "AUTH",
        });
    }
    static cannotEditOthersMessage(messageId, userId) {
        return new DomainError_1.DomainError(`User ${userId} cannot edit message ${messageId} because it belongs to another user`, "CANNOT_EDIT_OTHERS_MESSAGE", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.FORBIDDEN,
            errorType: ErrorType_1.ErrorType.AUTHORIZATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "AUTH",
        });
    }
    static cannotDeleteOthersMessage(messageId, userId) {
        return new DomainError_1.DomainError(`User ${userId} cannot delete message ${messageId} because it belongs to another user`, "CANNOT_DELETE_OTHERS_MESSAGE", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.FORBIDDEN,
            errorType: ErrorType_1.ErrorType.AUTHORIZATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "AUTH",
        });
    }
    static messageAlreadyDeleted(messageId) {
        return new DomainError_1.DomainError(`Message ${messageId} is already deleted`, "MESSAGE_ALREADY_DELETED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.CONFLICT,
            errorType: ErrorType_1.ErrorType.CONFLICT_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "CONFLICT",
        });
    }
    static cannotEditDeletedMessage(messageId) {
        return new DomainError_1.DomainError(`Message ${messageId} is deleted and cannot be edited`, "CANNOT_EDIT_DELETED_MESSAGE", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static messageEditWindowExpired(messageId) {
        return new DomainError_1.DomainError(`Message ${messageId} can no longer be edited because the edit window has expired`, "MESSAGE_EDIT_WINDOW_EXPIRED", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static invalidMessageTypeForEdit(messageId, type) {
        return new DomainError_1.DomainError(`Message ${messageId} of type ${type} cannot be edited`, "INVALID_MESSAGE_TYPE_FOR_EDIT", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
    static invalidMessageOperation(messageId, operation) {
        return new DomainError_1.DomainError(`Cannot ${operation} message ${messageId} due to its current state`, "INVALID_MESSAGE_OPERATION", {
            statusCode: HttpStatusCodes_1.HttpStatusCodes.BAD_REQUEST,
            errorType: ErrorType_1.ErrorType.VALIDATION_ERROR,
            shouldLog: false,
            isOperational: true,
            category: "VALIDATION",
        });
    }
}
exports.ChatErrors = ChatErrors;
//# sourceMappingURL=ChatErrors.js.map