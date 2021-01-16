# oganepa-ai-purchase-manager  
![Framework version](https://img.shields.io/github/package-json/dependency-version/siliconbear/oganepa-ai-purchase-manager/koa)
|![Release version](https://img.shields.io/github/v/release/SiliconBear/oganepa-ai-purchase-manager?style=for-the-badge)
This is the artificial intelligent application that handles purchases via whatsapp messaging using twilio-and-dialogflow integration.

## Development

To test webhooks, use ngrok.

### Using ngrok

installation:

`$ npm i ngrok -g`

Run the command:

`$ ngrok http 3000`

link in the console will be your webhook url:

```bash
Session Status                online
Session Expires               7 hours, 55 minutes
Version                       2.3.35
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://e49240cd9bcf.ngrok.io -> http://localhost:3
Forwarding                    https://e49240cd9bcf.ngrok.io -> http://localhost:

```
