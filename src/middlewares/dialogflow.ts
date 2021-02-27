import { SessionsClient } from "dialogflow";
import { Context } from "koa";
import {
  buildDialogflowEventRequest,
  buildDialogflowRequest,
  getDialogflowResponse,
} from "../utils";
import { environment } from "../environment";
import { MessageBirdBody } from "../types";

export const dialogflowMiddleware = async (
  ctx: Context,
  next: () => unknown
): Promise<unknown> => {
  const {
    message: {
      content: { text: receivedMessage },
      from: senderWhatsapp,
      to: channelWhatsapp,
      origin,
      platform,
    },
  } = <MessageBirdBody>ctx.request.body;

  const channelResponse = {
    receivedMessage,
    senderWhatsapp,
    channelWhatsapp,
    origin,
    platform,
  };

  const dialogflowOptions = {
    credentials: {
      client_email: environment.DIALOGFLOW_CLIENT__EMAIL,
      private_key: environment.DIALOGFLOW_PRIVATE__KEY,
    },
  };

  const sessionId = senderWhatsapp;
  const sessionClient = new SessionsClient(dialogflowOptions);

  const sessionPath = sessionClient.sessionPath(
    environment.DIALOGFLOW_PROJECT__ID,
    sessionId
  );

  const request = buildDialogflowRequest(sessionPath, receivedMessage);
  const responses = await sessionClient.detectIntent(request);

  const dialogflowResponse = getDialogflowResponse(responses);

  const detectIntent = async (contextMessage: string) => {
    const dialogRequest = buildDialogflowRequest(sessionPath, contextMessage);
    const dialogResponses = await sessionClient.detectIntent(dialogRequest);

    return getDialogflowResponse(dialogResponses);
  };

  const detectEvent = async (eventName: string, options = {}) => {
    const dialogRequest = buildDialogflowEventRequest(
      sessionPath,
      eventName,
      options
    );
    const dialogResponses = await sessionClient.detectIntent(dialogRequest);

    return getDialogflowResponse(dialogResponses);
  };

  ctx.request.body = {
    channelResponse,
    dialogflowResponse,
    detectIntent,
    detectEvent,
  };
  return next();
};
