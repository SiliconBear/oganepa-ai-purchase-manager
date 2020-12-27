import dialogflow from 'dialogflow';
import { buildDialogflowEventRequest, buildDialogflowRequest, getDialogflowResponse } from '../utils';
import { environment } from '../environment';
import { TwilioWhatsappResponse } from '../types';

export const intentMiddleware = async (ctx, next) => {

    const { Body: receivedMessage, From: senderWhatsapp, To: twilioWhatsapp } = <TwilioWhatsappResponse>ctx.request.body;
    const twilioResponse = { receivedMessage, senderWhatsapp, twilioWhatsapp };

    const dialogflowOptions = {
        credentials: {
            client_email: environment.DIALOGFLOW_CLIENT__EMAIL,
            private_key: environment.DIALOGFLOW_PRIVATE__KEY
        }
    }

    const sessionId = senderWhatsapp;
    const sessionClient = new dialogflow.SessionsClient(dialogflowOptions);
    const sessionPath = sessionClient.sessionPath(environment.DIALOGFLOW_PROJECT__ID, sessionId);

    const request = buildDialogflowRequest(sessionPath, receivedMessage);
    const responses = await sessionClient.detectIntent(request);

    const dialogflowResponse = getDialogflowResponse(responses);

    const detectIntent = async (contextMessage) => {
        const request = buildDialogflowRequest(sessionPath, contextMessage);
        const responses = await sessionClient.detectIntent(request);

        return getDialogflowResponse(responses);
    }

    const detectEvent = async (eventName) => {
        const request = buildDialogflowEventRequest(sessionPath, eventName);
        const responses = await sessionClient.detectIntent(request);

        return getDialogflowResponse(responses);
    }
    
    ctx.request.body = { twilioResponse, dialogflowResponse, detectIntent, detectEvent };
    return await next();
}