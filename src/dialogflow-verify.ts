const Realm = require("realm");
const twilio = require("twilio");

export const dialogflowVerify = async (ctx, next, extra) => {
    const twilioClient = new twilio("AC3acbf174a401aad6d7cdb4a054d827a0", "196404774e6c449b21b9dd803356330e");

    const request = ctx.request;
    const body = request.body;
    const { intent, parameters, fulfillmentText } = extra;
    
    await twilioClient.messages.create({
        from: 'whatsapp:+14155238886',
        body: `${fulfillmentText}`,
        to: 'whatsapp:+46760009821'
    }).catch((e) => console.log(e));




    const appId = "pawa-app-service-bjehx";
    const appConfig = {
        id: appId,
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
            from: 'whatsapp:+14155238886',
            body: `Your meter details: \n ${meternumber} \n*${result.customerName.trim()}*\n ${result.customerAddress}`,
            to: 'whatsapp:+46760009821'
        }).catch((e) => console.log(e));
        
        // dialo
    }

    ctx.body = { message: "successful" };

    await next();
}