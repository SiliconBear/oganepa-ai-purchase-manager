import { Context, Next } from "koa";
import { IntentIdentifiers } from "../../utils/intent";
import { IntentDialogBody } from "../../types";
import { meternumberVerify } from "./intents/meternumber-verify";
import { generatePaymentLink } from "./intents/generate-payment-link";
import { sendWhatsappMessage } from "../../utils/send-message";
import { generatePaymentReferenceLink } from "../../utils";

export const whatsappPurchaseFlow = async (
  ctx: Context,
  next: Next
): Promise<unknown> => {
  const { channelResponse, dialogflowResponse, detectEvent } = <
    IntentDialogBody
  >(<unknown>ctx.request.body);

  const { fulfillmentText, intent } = dialogflowResponse;
  const { senderWhatsapp, receivedMessage, origin, platform } = channelResponse;

  if (!(origin === "inbound" && platform === "whatsapp")) {
    console.log("(origin === inbound)", origin === "inbound");
    console.log("(platform === whatsapp)", platform === "whatsapp");
    ctx.status = 200;
    return next();
  }

  console.log("Customer ::=>", receivedMessage);
  console.log("Oganepa ::=>", fulfillmentText);

  await sendWhatsappMessage(
    senderWhatsapp,
    fulfillmentText.replace(/\\n/g, "\n")
  );

  if (intent.name === IntentIdentifiers.METER_VERIFIFCATION) {
    const { issuer, result, meternumber } = await meternumberVerify(
      dialogflowResponse
    );
    await sendWhatsappMessage(
      senderWhatsapp,
      `Meter details:\n${meternumber}\n*${result?.customerName.trim()}*\n_${
        result?.customerAddress
      }_`
    );

    const options = {
      parameters: {
        servicename: issuer?.serviceName,
      },
    };
    const continuePurchaseIntent = await detectEvent(
      "continue-purchase-intent",
      options
    );
    await sendWhatsappMessage(
      senderWhatsapp,
      continuePurchaseIntent.fulfillmentText.replace(/\\n/g, "\n")
    );
  }

  if (intent.name === IntentIdentifiers.PAYMENT_LINK_GENERATION) {
    const insertedPurchaseId = await generatePaymentLink(
      dialogflowResponse,
      senderWhatsapp
    );
    await sendWhatsappMessage(
      senderWhatsapp,
      `Pay here: ${generatePaymentReferenceLink(insertedPurchaseId)}`
    );

    const endPurchaseIntent = await detectEvent("end-purchase-intent");
    await sendWhatsappMessage(
      senderWhatsapp,
      endPurchaseIntent.fulfillmentText.replace(/\\n/g, "\n")
    );
  }

  ctx.status = 200;
  return next();
};
