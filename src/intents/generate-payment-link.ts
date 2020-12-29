import * as Realm from 'realm';
import { generatePaystackPaymentLink } from '../utils';
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

    const billerId = allParameters.fields.biller?.stringValue;
    const meternumber = allParameters.fields.meternumber?.stringValue;
    const amount = allParameters.fields.amount?.numberValue;
    const email = parameters.fields.email?.stringValue;

    console.log({ billerId, meternumber, amount, email });
    const total = (parseInt(amount) * 100);

    const database = await mongodb.db("electricity-vending");

    const purchase: any = {
        billerId,
        meternumber,
        total,
        status: "pending",
        phone: twilioResponse.senderWhatsapp.replace("whatsapp:", ""),
        currency: "NGN",
        email,
        // TODO: Fix servicename in context.
        serviceName: "unknown"
    };
    const insertedPurchase = await database.collection("purchases")
        .insertOne(purchase)
        .catch(console.log);

    if (insertedPurchase) {
        purchase._id = insertedPurchase.insertedId;
        
        await twilioClient.messages.create({
            from: twilioResponse.twilioWhatsapp,
            body: `Make payment: \n ${generatePaystackPaymentLink(purchase)} \n We will send you your recharge token shortly after your payment is successful.`,
            to: twilioResponse.senderWhatsapp
        }).catch((e) => console.log(e));


        // const resultr = await detectEvent("purchase-bridge");

        // await twilioClient.messages.create({
        //     from: twilioResponse.twilioWhatsapp,
        //     body: resultr.fulfillmentText,
        //     to: twilioResponse.senderWhatsapp
        // }).catch((e) => console.log(e));
    }

    return await next();
}