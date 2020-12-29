export enum SmsStatus {
    'received'
}

export type TwilioWhatsappResponse = {
    SmsMessageSid: string
    NumMedia: string
    SmsSid: string
    SmsStatus: SmsStatus
    Body: string
    // Our whatsapp numbeer (the recipient)
    To: string
    NumSegments: string
    MessageSid: string
    AccountSid: string
    // Customer (the sender)
    From: string
    ApiVersion: string
}

type TwilioResponse = { 
    receivedMessage: string
    senderWhatsapp: string
    twilioWhatsapp: string 
}

type Intent = { 
    name: string
    displayName: string
}

type DialogflowResponse = { 
    intent: Intent
    fulfillmentText: string
    parameters: any
    allParameters: any
}

export type IntentDialogBody = {
    twilioResponse: TwilioResponse
    dialogflowResponse: DialogflowResponse
    detectIntent: (intent: string)=>any
    detectEvent: (intent: string)=>any
}