import Realm from "realm";
import { struct } from "pb-util";
import { ObjectId } from "bson";
import { environment } from "../../../environment";
import { Purchase } from "../../../models/purchase";

export const generatePaymentLink = async (
  dialogflowResponse: any,
  senderWhatsapp: string
): Promise<string> => {
  const { parameters, allParameters } = dialogflowResponse;

  const app = new Realm.App(environment.REALM_APP_ID);
  const credentials = Realm.Credentials.anonymous();

  await app.logIn(credentials);
  const mongodb = app.currentUser.mongoClient("mongodb-atlas");

  const {
    biller,
    meternumber,
    amount,
    servicename: serviceName,
  } = struct.decode(allParameters);
  const { email } = struct.decode(parameters);

  const total = parseInt(amount.toString(), 10) * 100;

  const database = await mongodb.db(environment.REALM_DB_NAME);
  const purchase = {
    biller: biller.toString(),
    meternumber: meternumber.toString(),
    total,
    status: "pending",
    phone: senderWhatsapp,
    currency: "NGN",
    email: email.toString(),
    serviceName: serviceName.toString(),
  };

  const insertedPurchase = await database
    .collection<Purchase>("purchases")
    .insertOne(purchase);

  if (insertedPurchase) {
    const insertedPurchaseId = insertedPurchase.insertedId;
    return new ObjectId(insertedPurchaseId).toHexString();
  }

  return null;
};
