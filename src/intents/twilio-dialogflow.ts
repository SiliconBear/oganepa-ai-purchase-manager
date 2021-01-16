import { Twilio } from "twilio";
import { Context, Next } from "koa";
import { dialogflowVerify } from "./dialogflow-verify";
import { environment } from "../environment";
import { IntentDialogBody } from "../types";
import { generatePaymentLink } from "./generate-payment-link";
import { IntentIdentifiers } from "../utils/intent";

export const twilioDialogflow = async (
  ctx: Context,
  next: Next
): Promise<unknown> => {
  const twilioClient = new Twilio(
    environment.TWILIO_ACCOUNT__SID,
    environment.TWILIO_AUTH__TOKEN
  );

  const { twilioResponse, dialogflowResponse } = <IntentDialogBody>(
    (<unknown>ctx.request.body)
  );

  await twilioClient.messages
    .create({
      from: twilioResponse.twilioWhatsapp,
      body: dialogflowResponse.fulfillmentText.replace(/\\n/g, "\n"),
      to: twilioResponse.senderWhatsapp,
    })
    .catch((e) => console.log(e));

  if (
    dialogflowResponse.intent.name === IntentIdentifiers.METER_VERIFIFCATION
  ) {
    return dialogflowVerify(ctx, next);
  }

  if (
    dialogflowResponse.intent.name === IntentIdentifiers.PAYMENT_LINK_GENERATION
  ) {
    return generatePaymentLink(ctx, next);
  }

  return next();
};
