import { Context } from "koa";

export const verifyMessageBirdMiddleware = async (
  ctx: Context,
  next: () => unknown
): Promise<unknown> => {
  const { request } = ctx;
  if (
    !(
      request.header["messagebird-request-timestamp"] &&
      request.header["messagebird-signature"]
    )
  ) {
    ctx.status = 404;
    return false;
  }

  return next();
};
