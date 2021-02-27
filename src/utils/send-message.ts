import initMB, { SendResponse } from "messagebird";

const messagebird = initMB("a81TiQUBEYhJpwMLwmcu1ivfx");

export const sendWhatsappMessage = async (
  sender: string,
  message: string
): Promise<SendResponse> => {
  const params = {
    to: sender,
    from: "733fbb2f-06fc-46f6-9889-2e62c633734b",
    type: "text",
    content: {
      text: message,
    },
    reportUrl: "https://example.com/reports",
  };
  return new Promise((resolve, reject) => {
    messagebird.conversations.send(params, (err, response): void => {
      if (err) {
        return reject(err);
      }
      return resolve(response);
    });
  });
};
