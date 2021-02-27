export const environment = {
  DIALOGFLOW_PROJECT__ID: process.env.DIALOGFLOW_PROJECT__ID ?? "",
  DIALOGFLOW_CLIENT__EMAIL: process.env.DIALOGFLOW_CLIENT__EMAIL ?? "",
  DIALOGFLOW_PRIVATE__KEY:
    process.env.DIALOGFLOW_PRIVATE__KEY?.replace(/\\n/g, "\n") ?? "",
  REALM_APP_ID: process.env.REALM_APP_ID ?? "",
  REALM_DB_NAME: process.env.REALM_DB_NAME ?? "",
  OGANEPA_BASE_URL: process.env.OGANEPA_BASE_URL ?? "",
  MESSAGEBIRD_SIGNING_KEY: process.env.MESSAGEBIRD_SIGNING_KEY ?? "",
};
