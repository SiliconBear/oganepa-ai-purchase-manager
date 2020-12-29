
import { Twilio } from 'twilio';
import { dialogflowVerify } from "./dialogflow-verify";
import { environment } from '../environment';
import { IntentDialogBody } from '../types';
import { generatePaymentLink } from './generate-payment-link';
import { IntentIdentifiers } from '../utils/intent';


export const twilioDialogflow = async (ctx, next) => {
    const twilioClient = new Twilio(environment.TWILIO_ACCOUNT__SID, environment.TWILIO_AUTH__TOKEN);

    const { twilioResponse, dialogflowResponse, detectIntent } = <IntentDialogBody>ctx.request.body;

    await twilioClient.messages.create({
        from: twilioResponse.twilioWhatsapp,
        body: dialogflowResponse.fulfillmentText.replace(/\\n/g, '\n'),
        to: twilioResponse.senderWhatsapp
    }).catch((e) => console.log(e));

    if (dialogflowResponse.intent.name === IntentIdentifiers.METER_VERIFIFCATION) {
        return await dialogflowVerify(ctx, next);
    }

    if (dialogflowResponse.intent.name === IntentIdentifiers.PAYMENT_LINK_GENERATION) {
        return await generatePaymentLink(ctx, next);
    }

    return await next();
}