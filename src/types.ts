import { JsonValue } from "pb-util/build";

export enum SmsStatus {
  "received",
}

type ChannelResponse = {
  receivedMessage: string;
  senderWhatsapp: string;
  channelWhatsapp: string;
  platform: string;
  origin: string;
};

type Intent = {
  name: string;
  displayName: string;
};

export type DialogflowResponse = {
  intent: Intent;
  fulfillmentText: string;
  parameters: Record<string, any>;
  allParameters: Record<string, any>;
};

export type IntentDialogBody = {
  channelResponse: ChannelResponse;
  dialogflowResponse: DialogflowResponse;
  detectIntent: (contextMessage: string) => Promise<Record<string, string>>;
  detectEvent: (
    eventName: string,
    options?: Record<string, string | string | unknown>
  ) => Promise<Record<string, string>>;
};

enum MessageType {
  CREATED = "message.created",
  UPDATED = "message.updated",
}

export type Contact = {
  attributes: Record<string, string>;
  createdDatetime: string;
  customDetails: Record<string, string>;
  displayName: string;
  firstName: string;
  href: string;
  id: string;
  lastName: string;
  msisdn: number;
  updatedDatetime: string;
};

export type Message = {
  channelId: string;
  conversationId: string;
  content: { text: string };
  createdDatetime: string;
  direction: string;
  from: string;
  id: string;
  origin: string;
  platform: string;
  status: string;
  to: string;
  type: string;
  updatedDatetime: string;
};

export type Conversation = {
  contactId: string;
  createdDatetime: string;
  id: string;
  lastReceivedDatetime: string;
  status: string;
  updatedDatetime: string;
};

export type MessageBirdBody = {
  contact: Contact;
  conversation: Conversation;
  message: Message;
  type: MessageType;
};
