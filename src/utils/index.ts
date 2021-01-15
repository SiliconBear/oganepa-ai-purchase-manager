import { struct } from "pb-util";
import { environment } from "../environment";

export const buildDialogflowRequest = (
  session: unknown,
  text: string
): unknown => {
  return {
    session,
    queryInput: {
      text: {
        text,
        languageCode: "en-US",
      },
    },
  };
};

export const buildDialogflowEventRequest = (
  session: unknown,
  eventName: string,
  options: { parameters?: Record<string, string> }
): unknown => ({
  session,
  queryInput: {
    event: {
      name: eventName,
      languageCode: "en-US",
      parameters: options.parameters ? struct.encode(options.parameters) : {},
    },
  },
});

export const getDialogflowResponse = (
  responses: { queryResult: any }[]
): unknown => {
  const result = responses[0].queryResult;

  const {
    intent: { name: intentName, displayName: intentDisplayName },
    fulfillmentText,
    parameters,
    outputContexts,
  } = result;
  const intent = { name: intentName, displayName: intentDisplayName };

  const allParameters = { fields: {} };
  outputContexts.forEach((context: { parameters: { fields: {} } }) => {
    allParameters.fields = {
      ...allParameters.fields,
      ...context.parameters?.fields,
    };
  });

  return { intent, fulfillmentText, parameters, allParameters };
};

export const generatePaymentReferenceLink = (_id: string): string => {
  return `${environment.OGANEPA_BASE_URL}/payment?reference=${_id}`;
};
