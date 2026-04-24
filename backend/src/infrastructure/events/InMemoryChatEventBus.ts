import { inject, injectable } from "inversify";
import { IChatEventBus } from "@application/services/IChatEventBus";
import { IChatRealtimeService } from "@application/services/IChatRealtimeService";
import {
  ChatDomainEvent,
  ChatMessageDeletedEvent,
  ChatMessageEditedEvent,
  ChatMessageSentEvent,
  ChatMessageViewedEvent,
} from "@application/events/ChatEvents";
import { TYPES } from "@shared/constants/DITypes";
import { Logger } from "@shared/utils/Logger";

@injectable()
export class InMemoryChatEventBus implements IChatEventBus {
  constructor(
    @inject(TYPES.ChatRealtimeService)
    private readonly chatRealtimeService: IChatRealtimeService,
  ) {}

  async publish(event: ChatDomainEvent): Promise<void> {
    switch (event.type) {
      case "ChatMessageSent":
        return this.handleMessageSent(event);
      case "ChatMessageEdited":
        return this.handleMessageEdited(event);
      case "ChatMessageDeleted":
        return this.handleMessageDeleted(event);
      case "ChatMessageViewed":
        return this.handleMessageViewed(event);
      default: {
        const exhaustiveCheck: never = event;
        Logger.warn("Unhandled chat event", { event: exhaustiveCheck });
        return;
      }
    }
  }

  private async handleMessageSent(event: ChatMessageSentEvent): Promise<void> {
    await this.chatRealtimeService.notifyMessageSent(event.payload);
  }

  private async handleMessageEdited(
    event: ChatMessageEditedEvent,
  ): Promise<void> {
    await this.chatRealtimeService.notifyMessageEdited(event.payload);
  }

  private async handleMessageDeleted(
    event: ChatMessageDeletedEvent,
  ): Promise<void> {
    await this.chatRealtimeService.notifyMessageDeleted(event.payload);
  }

  private async handleMessageViewed(
    event: ChatMessageViewedEvent,
  ): Promise<void> {
    await this.chatRealtimeService.notifyMessageViewed(event.payload);
  }
}
