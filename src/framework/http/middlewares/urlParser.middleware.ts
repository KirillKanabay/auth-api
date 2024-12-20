import {Middleware} from "../types/middleware.type";

export const urlParserMiddleware = (baseUrl:string): Middleware => async  (ctx, req, res, next) => {
    ctx.urlPathname = new URL(req.url!, baseUrl).pathname;
    await next();
}