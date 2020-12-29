export const buildDialogflowRequest = (session, text) => ({
    session,
    queryInput: {
        text: {
            text,
            languageCode: 'en-US',
        },
    },
});

export const buildDialogflowEventRequest = (session, eventName) => ({
    session,
    queryInput: {
        event: {
            name: eventName,
            languageCode: 'en-US',
        },
    },
});

export const getDialogflowResponse = (responses) => {
    const result = responses[0].queryResult;

    const { intent: { name: intentName, displayName: intentDisplayName }, fulfillmentText, parameters, outputContexts } = result;
    const intent = { name: intentName, displayName: intentDisplayName };

    let allParameters = { fields: {} };
    outputContexts.forEach((context) => {
        allParameters.fields = { ...allParameters.fields, ...context.parameters?.fields };
    })

    return { intent, fulfillmentText, parameters, allParameters }
}


export const generatePaystackPaymentLink = (purchase) => {
    const { _id, email, total, phone } = purchase
    return `https://paystack.com/pay/oganepa?email=${encodeURIComponent(email)}&reference=${_id}&whatsapp=${phone}&amount=${total/100}`;
}