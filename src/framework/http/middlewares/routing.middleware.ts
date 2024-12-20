import {Middleware} from "../types/middleware.type";
import {Router} from "../router";

export const routingMiddleware = (router:Router): Middleware => async (ctx, req, res, next) => {
    if(!ctx.urlPathname){
        throw new Error('Url pathname is not set');
    }

    const endpoint = router.findEndpoint(ctx.urlPathname, req.method as HttpMethod);

    if(endpoint){
        ctx.endpoint = endpoint;
        req.params = endpoint.params;
        await next();
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
}