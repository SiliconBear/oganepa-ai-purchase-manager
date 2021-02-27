import Koa from "koa";
import Router from "koa-router";

import logger from "koa-logger";
import json from "koa-json";
import bodyParser from "koa-bodyparser";
import { dialogflowMiddleware } from "./middlewares/dialogflow";
import { whatsappPurchaseFlow } from "./module/whatsapp";
import { verifyMessageBirdMiddleware } from "./middlewares/verify-signature";

const app = new Koa();
const router = new Router();

// Twilio-Dialogflow
router.post(
  "/ai-purchase-manager",
  verifyMessageBirdMiddleware,
  dialogflowMiddleware,
  whatsappPurchaseFlow
);
router.post("/log", (ctx) => {
  console.log("<unknown>", ctx.request.body);
  ctx.status = 200;
});

// Middlewares
app.use(json());
app.use(logger());
app.use(bodyParser());

// Routes
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log("Purchase manager started");
});
