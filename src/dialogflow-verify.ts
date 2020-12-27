import * as Realm from 'realm';
import { Twilio } from 'twilio';
import dialogflow from 'dialogflow';
import { environment } from './environment';

export const dialogflowVerify = async (ctx, next, extra) => {
    const twilioClient = new Twilio(environment.TWILIO_ACCOUNT__SID, environment.TWILIO_AUTH__TOKEN);

    const request = ctx.request;
    const body = request.body;
    const { intent, parameters, fulfillmentText } = extra;

    await twilioClient.messages.create({
        from: environment.TWILIO_WHATSAPP__NUMBER,
        body: `${fulfillmentText}`,
        to: 'whatsapp:+46760009821'
    }).catch((e) => console.log(e));

    
    const appConfig = {
        id: environment.REALM_APP_ID,
        timeout: 10000,
    };

    const app = new Realm.App(appConfig);
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
            from: environment.TWILIO_WHATSAPP__NUMBER,
            body: `Your meter details: \n ${meternumber} \n*${result.customerName.trim()}*\n ${result.customerAddress}`,
            to: 'whatsapp:+46760009821'
        }).catch((e) => console.log(e));


        const dialogflowOptions = {
            credentials: {
                client_email: environment.DIALOGFLOW_CLIENT__EMAIL,
                private_key: environment.DIALOGFLOW_PRIVATE__KEY
            }
        }

        const sessionId = body.From;
        const sessionClient = new dialogflow.SessionsClient(dialogflowOptions);
        const sessionPath = sessionClient.sessionPath(environment.DIALOGFLOW_PROJECT__ID, sessionId);

        const requestVariables = {
            session: sessionPath,
            queryInput: {
                event: {
                    name: "purchase-bridge",
                    languageCode: 'en-US',
                }
            },
        };

        const responses = await sessionClient.detectIntent(requestVariables);
        const resultr = responses[0].queryResult;

        await twilioClient.messages.create({
            from: environment.TWILIO_WHATSAPP__NUMBER,
            body: resultr.fulfillmentText,
            to: 'whatsapp:+46760009821'
        }).catch((e) => console.log(e));

    }

    ctx.body = { message: "successful" };

    return await next();
}