
import { Twilio } from 'twilio';
import { dialogflowVerify } from "./dialogflow-verify";
import { environment } from '../environment';
import { IntentDialogBody } from '../types';


export const twilioDialogflow = async (ctx, next) => {
    const twilioClient = new Twilio(environment.TWILIO_ACCOUNT__SID, environment.TWILIO_AUTH__TOKEN);

    const { twilioResponse, dialogflowResponse, detectIntent } = <IntentDialogBody>ctx.request.body;

    if (dialogflowResponse.intent.displayName === "Meternumber") {
        return await dialogflowVerify(ctx, next, dialogflowResponse);
    }

    await twilioClient.messages.create({
        from: twilioResponse.twilioWhatsapp,
        body: dialogflowResponse.fulfillmentText,
        to: twilioResponse.senderWhatsapp
    }).catch((e) => console.log(e));

    return await next();
}