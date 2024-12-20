import {Middleware} from "../types/middleware.type";

export const endpointExecutionMiddleware : Middleware = async (ctx, req, res, next) => {
    const {endpoint} = ctx;

    if(endpoint){
        await endpoint.handler(req, res);
    }

    await next();
}