
import { Twilio } from 'twilio';
import dialogflow from 'dialogflow';
import { dialogflowVerify } from "./dialogflow-verify";
import { environment } from './environment';


enum SmsStatus {
    'received'
}
type TwilioWhatsappResponse = {
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

export const twilioDialogflow = async (ctx, next) => {
    const twilioClient = new Twilio(environment.TWILIO_ACCOUNT__SID, environment.TWILIO_AUTH__TOKEN);

    const { Body, From } = <TwilioWhatsappResponse>ctx.request.body;

    const dialogflowOptions = {
        credentials: {
            client_email: environment.DIALOGFLOW_CLIENT__EMAIL,
            private_key: environment.DIALOGFLOW_PRIVATE__KEY
        }
    }

    const sessionId = From;
    const sessionClient = new dialogflow.SessionsClient(dialogflowOptions);
    const sessionPath = sessionClient.sessionPath(environment.DIALOGFLOW_PROJECT__ID, sessionId);

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: Body,
                languageCode: 'en-US',
            },
        },
    };


    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    console.log(`  Full Response:`, JSON.stringify(responses));

    const { intent } = result;
    if (intent.displayName === "Meternumber") {
        return await dialogflowVerify(ctx, next, result);
    }

    await twilioClient.messages.create({
        from: environment.TWILIO_WHATSAPP__NUMBER,
        body: result.fulfillmentText,
        to: 'whatsapp:+46760009821'
    }).catch((e) => console.log(e));

    ctx.body = result.fulfillmentText;
    return await next();
}