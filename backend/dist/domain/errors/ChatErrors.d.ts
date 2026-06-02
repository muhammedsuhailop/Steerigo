import { DomainError } from "./DomainError";
export declare class ChatErrors {
    static rideNotFound(rideId: string): DomainError;
    static chatRoomNotFoundByRide(rideId: string): DomainError;
    static chatRoomNotFound(chatRoomId: string): DomainError;
    static unauthorizedChatAccess(chatRoomId: string, userId: string): DomainError;
    static unauthorizedRideChatAccess(rideId: string, userId: string): DomainError;
    static rideNotEligibleForChat(rideId: string, status: string): DomainError;
    static chatRoomAlreadyExists(rideId: string): DomainError;
    static chatRoomEnded(chatRoomId: string): DomainError;
    static invalidMessageContent(): DomainError;
    static messageNotFound(messageId: string): DomainError;
    static unauthorizedMessageAccess(messageId: string, userId: string): DomainError;
    static cannotEditOthersMessage(messageId: string, userId: string): DomainError;
    static cannotDeleteOthersMessage(messageId: string, userId: string): DomainError;
    static messageAlreadyDeleted(messageId: string): DomainError;
    static cannotEditDeletedMessage(messageId: string): DomainError;
    static messageEditWindowExpired(messageId: string): DomainError;
    static invalidMessageTypeForEdit(messageId: string, type: string): DomainError;
    static invalidMessageOperation(messageId: string, operation: "edit" | "delete"): DomainError;
}
//# sourceMappingURL=ChatErrors.d.ts.map