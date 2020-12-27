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

    const { intent: { name: intentName, displayName: intentDisplayName }, fulfillmentText, parameters } = result;
    const intent = { name: intentName, displayName: intentDisplayName };

    return { intent, fulfillmentText, parameters }
}