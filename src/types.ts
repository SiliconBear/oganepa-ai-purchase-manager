import { JsonValue } from "pb-util/build";

export enum SmsStatus {
  "received",
}

export type TwilioWhatsappResponse = {
  SmsMessageSid: string;
  NumMedia: string;
  SmsSid: string;
  SmsStatus: SmsStatus;
  Body: string;
  // Our whatsapp numbeer (the recipient)
  To: string;
  NumSegments: string;
  MessageSid: string;
  AccountSid: string;
  // Customer (the sender)
  From: string;
  ApiVersion: string;
};

type TwilioResponse = {
  receivedMessage: string;
  senderWhatsapp: string;
  twilioWhatsapp: string;
};

type Intent = {
  name: string;
  displayName: string;
};

type DialogflowResponse = {
  intent: Intent;
  fulfillmentText: string;
  parameters: Record<string, any>;
  allParameters: Record<string, any>;
};

export type IntentDialogBody = {
  twilioResponse: TwilioResponse;
  dialogflowResponse: DialogflowResponse;
  detectIntent: (intent: string) => any;
  detectEvent: (intent: string, options?: any) => any;
};

export type Purchase = {
  biller: JsonValue;
  meternumber: JsonValue;
  total: JsonValue;
  status: JsonValue;
  phone: JsonValue;
  currency: JsonValue;
  email: JsonValue;
  serviceName: JsonValue;
}
