import * as Realm from "realm";
import { struct } from "pb-util";
import { Twilio } from "twilio";
import { Context, Next } from "koa";
import { environment } from "../environment";
import { IntentDialogBody } from "../types";

export const dialogflowVerify = async (
  ctx: Context,
  next: Next
): Promise<unknown> => {
  const twilioClient = new Twilio(
    environment.TWILIO_ACCOUNT__SID,
    environment.TWILIO_AUTH__TOKEN
  );

  const { twilioResponse, dialogflowResponse, detectEvent } = <
    IntentDialogBody
  >ctx.request.body;
  const { parameters, allParameters } = dialogflowResponse;

  const app = new Realm.App(environment.REALM_APP_ID);
  const credentials = Realm.Credentials.anonymous();

  const user = await app.logIn(credentials);
  const mongodb = app.currentUser.mongoClient("mongodb-atlas");

  const { biller } = struct.decode(parameters);
  const { meternumber } = struct.decode(allParameters);

  const database = mongodb.db("electricity-vending");
  const issuer = await database
    .collection("issuers")
    .findOne({ biller })
    .catch(console.log);

  const result = await user.functions
    .validateMeterNumber({
      biller,
      meternumber,
      serviceName: issuer.serviceName,
    })
    .catch(console.log);

  if (result) {
    await twilioClient.messages
      .create({
        from: twilioResponse.twilioWhatsapp,
        body: `Meter details:\n${meternumber}\n*${result.customerName.trim()}*\n_${
          result.customerAddress
        }_`,
        to: twilioResponse.senderWhatsapp,
      })
      .catch((e) => console.log(e));

    const options = {
      parameters: {
        servicename: issuer.serviceName,
      },
    };

    const continuePurchaseIntent = await detectEvent(
      "continue-purchase-intent",
      options
    );
    await twilioClient.messages
      .create({
        from: twilioResponse.twilioWhatsapp,
        body: continuePurchaseIntent.fulfillmentText.replace(/\\n/g, "\n"),
        to: twilioResponse.senderWhatsapp,
      })
      .catch((e) => console.log(e));
  }

  return next();
};
