
export const twilioDialogflow = async (ctx, next) => {
    const dialogflow = require('dialogflow');
//   console.log(JSON.stringify(payload));
//   console.log(payload.Body);
  
//   const text = payload.Body;
//   const id = payload.From;
  
//   const projectId = "oganepa-299322";
//   const sessionId = BSON.ObjectId();
  
//   const sessionClient = new dialogflow.SessionsClient();
//   const sessionPath = sessionClient.sessionPath(projectId, sessionId);
  
//   const request = {
//     session: sessionPath,
//     queryInput: {
//       text: {
//         text,
//         languageCode: 'en-US',
//       },
//     },
//   };
  
//   try {
//     const responses = await sessionClient.detectIntent(request);
//     const result = responses[0].queryResult;
//     console.log(`  Query: ${result.queryText}`);
//     console.log(`  Response: ${result.fulfillmentText}`);
  
//     const dialogflowResponse = responses.fulfillmentText;
//     console.log(`  DialogflowResponse: ${dialogflowResponse}`);
    
    const twilio = require("twilio");
    const twilioClient = new twilio("AC3acbf174a401aad6d7cdb4a054d827a0", "196404774e6c449b21b9dd803356330e");
    
    await twilioClient.messages.create({
        from: 'whatsapp:+14155238886',
        body: 'Hello there!',
        to: 'whatsapp:+46760009821'
    }).catch((e)=>console.log(e));
    
//     return dialogflowResponse;
//   } catch(err) {
//       console.log('Error getting response',err);
//       throw (err);
//   }
  const { name } = <any>ctx.request.body;
  ctx.body = { name: "Alabi Pasuma" };
  await next();
}