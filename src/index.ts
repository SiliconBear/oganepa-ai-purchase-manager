import * as Koa from "koa";
import * as Router from "koa-router";

import * as logger from "koa-logger";
import * as json from "koa-json";
import * as bodyParser from "koa-bodyparser";
import { twilioDialogflow } from "./intents/twilio-dialogflow";
import { dialogflowMiddleware } from "./middlewares/dialogflow";

const app = new Koa();
const router = new Router();

// Twilio-Dialogflow
router.post("/ai-purchase-manager", dialogflowMiddleware, twilioDialogflow);

// Middlewares
app.use(json());
app.use(logger());
app.use(bodyParser());

// Routes
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log("Purchase manager started");
});
