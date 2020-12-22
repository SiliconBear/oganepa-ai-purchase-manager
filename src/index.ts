
import * as Koa from "koa";
import * as Router from "koa-router";

import * as logger from "koa-logger";
import * as json from "koa-json";
import * as bodyParser from "koa-bodyparser";
import { twilioDialogflow } from "./twilio-dialogflow";

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const app = new Koa();
const router = new Router();

interface HelloRequest {
  name: string;
}

// Hello world
router.get("/ai-purchase-manager", twilioDialogflow);

// Middlewares
app.use(json());
app.use(logger());
app.use(bodyParser());

// Routes
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log("Koa started");
});