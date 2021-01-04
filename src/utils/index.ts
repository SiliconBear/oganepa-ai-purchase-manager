import { struct } from 'pb-util';

export const buildDialogflowRequest = (session, text) => ({
    session,
    queryInput: {
        text: {
            text,
            languageCode: 'en-US',
        },
    },
});

export const buildDialogflowEventRequest = (session, eventName, options) => ({
    session,
    queryInput: {
        event: {
            name: eventName,
            languageCode: 'en-US',
            parameters: options.parameters?struct.encode(options.parameters) : {}
        },
    }
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


export const generatePaymentReferenceLink = (_id) => {
    return `http://test.oganepa.com/payment?reference=${_id}`;
}