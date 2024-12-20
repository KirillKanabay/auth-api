import {Middleware} from "../types/middleware.type";
import {internalServerError} from "../serverResponse.utils";

export const exceptionHandlingMiddleware : Middleware = async (ctx, req, res, next) => {
    try {
        await next();
    } catch(e) {
        console.error(e);
        internalServerError(res);
    }
}