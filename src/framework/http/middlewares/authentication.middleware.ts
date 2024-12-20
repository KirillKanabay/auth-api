import {Middleware} from "../types/middleware.type";
import {unauthorized} from "../serverResponse.utils";
import {JwtService} from "../services/jwt.service";

export const authenticationMiddleware: Middleware = async (ctx, req, res, next) => {
    const endpoint = ctx.endpoint;

    if(!endpoint?.options?.authorized){
        await next();
        return;
    }

    const authHeader = req.headers['authorization'];

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return unauthorized(res);
    }

    const authToken = authHeader.split(' ')[1];
    const userClaims = JwtService.parse(authToken);

    if(!userClaims || !userClaims.login ||userClaims.exp < Date.now()){
        return unauthorized(res);
    }

    ctx.claims = userClaims;

    await next();
}