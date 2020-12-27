import * as Realm from 'realm';
import { Twilio } from 'twilio';
import { environment } from '../environment';
import { IntentDialogBody } from '../types';

export const dialogflowVerify = async (ctx, next, extra) => {
    const twilioClient = new Twilio(environment.TWILIO_ACCOUNT__SID, environment.TWILIO_AUTH__TOKEN);

    const { twilioResponse, dialogflowResponse, detectEvent } = <IntentDialogBody>ctx.request.body;
    const { intent, parameters, fulfillmentText } = dialogflowResponse;

    await twilioClient.messages.create({
        from: twilioResponse.twilioWhatsapp,
        body: `${fulfillmentText}`,
        to: twilioResponse.senderWhatsapp
    }).catch((e) => console.log(e));

    const app = new Realm.App(environment.REALM_APP_ID);
    const credentials = Realm.Credentials.anonymous();

    const user = await app.logIn(credentials);
    const mongodb = app.currentUser.mongoClient("mongodb-atlas");

    const billerId = parameters.fields.biller.stringValue;
    const meternumber = parameters.fields.meternumber.stringValue;

    const database = await mongodb.db("electricity-vending");
    const biller = await database.collection("issuers").findOne({ billerId })
        .catch(console.log);

    const result = await user.functions
        .validateMeterNumber({
            billerId,
            meternumber,
            serviceName: biller.serviceName
        }).catch(console.log);

    if (result) {
        await twilioClient.messages.create({
            from: twilioResponse.twilioWhatsapp,
            body: `Your meter details: \n ${meternumber} \n*${result.customerName.trim()}*\n ${result.customerAddress}`,
            to: twilioResponse.senderWhatsapp
        }).catch((e) => console.log(e));


        const resultr = await detectEvent("purchase-bridge");

        await twilioClient.messages.create({
            from: twilioResponse.twilioWhatsapp,
            body: resultr.fulfillmentText,
            to: twilioResponse.senderWhatsapp
        }).catch((e) => console.log(e));

    }

    return await next();
}