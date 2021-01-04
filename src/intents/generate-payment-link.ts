import * as Realm from 'realm';
import { struct } from 'pb-util';
import { generatePaymentReferenceLink } from '../utils';
import { Twilio } from 'twilio';
import { environment } from '../environment';
import { IntentDialogBody } from '../types';


export const generatePaymentLink = async (ctx, next) => {
    const twilioClient = new Twilio(environment.TWILIO_ACCOUNT__SID, environment.TWILIO_AUTH__TOKEN);

    const { twilioResponse, dialogflowResponse, detectEvent } = <IntentDialogBody>ctx.request.body;
    const { intent, parameters, fulfillmentText, allParameters } = dialogflowResponse;

    const app = new Realm.App(environment.REALM_APP_ID);
    const credentials = Realm.Credentials.anonymous();

    const user = await app.logIn(credentials);
    const mongodb = app.currentUser.mongoClient("mongodb-atlas");

    const { biller: billerId, meternumber, amount, servicename: serviceName } = struct.decode(allParameters);
    const { email } = struct.decode(parameters);
    const total = parseInt(amount.toString()) * 100;

    console.log({ billerId, meternumber, amount, email });

    const database = await mongodb.db("electricity-vending");
    const purchase: any = {
        billerId,
        meternumber,
        total,
        status: "pending",
        phone: twilioResponse.senderWhatsapp.replace("whatsapp:", ""),
        currency: "NGN",
        email,
        serviceName
    };
    const insertedPurchase = await database.collection("purchases")
        .insertOne(purchase)
        .catch(console.log);

    if (insertedPurchase) {
        purchase._id = insertedPurchase.insertedId;

        await twilioClient.messages.create({
            from: twilioResponse.twilioWhatsapp,
            body: `Pay here: ${generatePaymentReferenceLink(insertedPurchase.insertedId)}`,
            to: twilioResponse.senderWhatsapp
        }).catch((e) => console.log(e));

        const endPurchaseIntent = await detectEvent("end-purchase-intent");
        await twilioClient.messages.create({
            from: twilioResponse.twilioWhatsapp,
            body: endPurchaseIntent.fulfillmentText.replace(/\\n/g, '\n'),
            to: twilioResponse.senderWhatsapp
        }).catch((e) => console.log(e));
    }

    return await next();
}