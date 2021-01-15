export const environment = {
  TWILIO_ACCOUNT__SID: process.env.TWILIO_ACCOUNT__SID ?? "",
  TWILIO_AUTH__TOKEN: process.env.TWILIO_AUTH__TOKEN ?? "",
  TWILIO_WHATSAPP__NUMBER: process.env.TWILIO_WHATSAPP__NUMBER ?? "",
  DIALOGFLOW_PROJECT__ID: process.env.DIALOGFLOW_PROJECT__ID ?? "",
  DIALOGFLOW_CLIENT__EMAIL: process.env.DIALOGFLOW_CLIENT__EMAIL ?? "",
  DIALOGFLOW_PRIVATE__KEY:
    process.env.DIALOGFLOW_PRIVATE__KEY?.replace(/\\n/g, "\n") ?? "",
  REALM_APP_ID: process.env.REALM_APP_ID ?? "",
  OGANEPA_BASE_URL: process.env.OGANEPA_BASE_URL ?? "",
};
