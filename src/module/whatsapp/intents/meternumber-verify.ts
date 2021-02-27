import Realm from "realm";
import { struct } from "pb-util";
import { environment } from "../../../environment";
import { DialogflowResponse } from "../../../types";
import { Issuer } from "../../../models/issuer";

const app = new Realm.App(environment.REALM_APP_ID);

export const meternumberVerify = async (
  dialogflowResponse: DialogflowResponse
): Promise<{ issuer: Issuer; result: any; meternumber: string }> => {
  const { parameters, allParameters } = dialogflowResponse;

  try {
    const credentials = Realm.Credentials.anonymous();
    await app.logIn(credentials);
  } catch (err) {
    throw new Error(err);
  }

  const mongodb = await app.currentUser.mongoClient("mongodb-atlas");
  const database = mongodb.db(environment.REALM_DB_NAME);

  const { biller } = struct.decode(parameters);
  const { meternumber } = struct.decode(allParameters);

  const issuer = await database
    .collection<Issuer>("issuers")
    .findOne({ biller });

  const result = await app.currentUser.functions.validateMeterNumber({
    biller,
    meternumber,
    serviceName: issuer?.serviceName ?? "",
  });

  return { issuer, result, meternumber: meternumber.toString() };
};
