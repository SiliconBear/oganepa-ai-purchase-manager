import { dialogflowVerify } from "./dialogflow-verify";

enum SmsStatus {
    'received'
}
type TwilioWhatsappResponse = {
    SmsMessageSid: string
    NumMedia: string
    SmsSid: string
    SmsStatus: SmsStatus
    Body: string
    // Our whatsapp numbeer (the recipient)
    To: string
    NumSegments: string
    MessageSid: string
    AccountSid: string
    // Customer (the sender)
    From: string
    ApiVersion: string
}

export const twilioDialogflow = async (ctx, next) => {
    const dialogflow = require('dialogflow');

    const { Body, From } = <TwilioWhatsappResponse>ctx.request.body;

    const projectId = "oganepa-299322";
    const sessionId = From;

    const options = {
        credentials: {
            client_email: "oganepa-twilio@oganepa-299322.iam.gserviceaccount.com",
            private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDplMiXbU2x2x52\nx7Umwevg1buCmOP8oLXPTibx+xxoho5MGRW+bu159hOzN0R5uU3qCBGqiE8d6Pd/\no3Ge04SGyq1yVvuvYFtnXQNzFuCtWInXlRHGxUrCiKLNGmJX/YAGwB4oPQDEdePQ\nVdm/ugynYHWMIiCQPfg+H/OM/yQn2zwNQVaMtZeQwAeT834gemrJaVWoggxg+r2g\n+vaVp8kKwc87FQVbcfQnL7EcoVxBeZhhasRctlGqSYn2hcM1SpjvyFQm8/YEg9x2\nhDRcCW0FVZM0by852Qa59/6HAh3/1MqVEEWw2dA0jxzoWeCLVhfnS9ouO6K9iZi/\nldEazOcVAgMBAAECggEAJXHOfkftbpeb2JrHNYFc2NwqhRMRaUwyGRuELsJ8mV0I\nrrZOwAp0U1rZaZ9wgLrt/JhyjI3xcPAJzRJcgoOR+THAgFXlXwXpYTaN+QMv3VoW\nLtMc2GqEQ4832f1iyow+29Ysf3LYDqZ/cMRydcPTh3l1HpPR+I2WoA7rMi0slJ7I\nHTdacqDfkVlSxmr70LtGcDCX5mTuKndgrhq9UJ8iyX/K1FPg7CGbgxSz3TMmMFEj\nCrfjUTEgtUuv5Vl6H7N9uRAMDbwaHTwAHxiohwGuG0QipjIBH2OLqXDXh5OTWJZx\nCtyLhIUblI7ImSdEb0k5M/FPEgxQIhe3538aaOXtOQKBgQD8/O4zdkXYJRiTGrCS\n3tNsihAj4RuVZtvJapCDdWSZ+TwEXISvjZZ+6O8VLKsDVLkacpQJ+3yd08P1kVxQ\nvYjyBSjUOEJP1rN9c9VMsztSRJSHx0at/9BxAQRM+XwSrCmIWU9k9esSbcD9iM6e\ng6B9yHCi9dkEjvIvC9lBmdJJrwKBgQDsXLQ5Np4Wy5b61vudiFa/lqea+L9kCMCT\nrtoQmfC9gKu/j2cG50iVDLu8sGNt2EBWRFgqMrjmm8mh0gyPiIfFHjzuqVdyMiYD\nN6/XDJt9zmTLCmg3gcD4CzPmwp3mxbY7n2A6nlvzr0H75XfrqO4SqQFAl8XWBXap\n52s5x9SAewKBgAmRy7TYoXW2mYJe/RThJuAxLMEer7tsA55P0J2YYDDO061ajo5R\nbcLpLrn/UYyztLjCYsUp5SHXM89jKznGoZp+BXhZlHCOr4VsT0IyeWj4PSIRsKO+\nTHUp067RtRbDumJ09mLcRoMQ8b7lYONwGS8I2PHhGM9qVNDgwtwPZHvzAoGAOobq\nCZDArJxVEl/RhjyQXniLoBAgNEEGjospbBryRbpqzNBRjqAOlPnGMv7qX/TAWZwq\nyKguqMvCrdM5UQFZvTGznNVJ1fkc+Ib9f56bkhddVfmJvNTgV4tOmsFuIAqtCS55\nwYoc8sZe7GTxwOTfrrcynC/4yPopXAD1yCT3NakCgYBCrmrts0OoPmNWlb4tOZ3o\nCGnu9kpilfxlMz1hwZ3T13cTotP5LTvNigW/GXpIg6f82YkQdIutTE0JIGlEjlBc\nibT+6c8LRSInjcG9uvHabdsD4cBTTCcrbg0mx2yto4TPgI0QiStd7S6xZgEFsdiE\nMO3oS5Pl4IZt7Dror45Tdg==\n-----END PRIVATE KEY-----\n"
        }
    }

    const sessionClient = new dialogflow.SessionsClient(options);
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: Body,
                languageCode: 'en-US',
            },
        },
    };


    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    console.log(`  Full Response:`, JSON.stringify(responses));

    const { intent } = result;
    if (intent.displayName === "Meternumber") {
        return await dialogflowVerify(ctx, next, result);
    }

    const twilio = require("twilio");
    const twilioClient = new twilio("AC3acbf174a401aad6d7cdb4a054d827a0", "196404774e6c449b21b9dd803356330e");

    await twilioClient.messages.create({
        from: 'whatsapp:+14155238886',
        body: result.fulfillmentText,
        to: 'whatsapp:+46760009821'
    }).catch((e) => console.log(e));
    
    ctx.body = result.fulfillmentText;
    await next();
}