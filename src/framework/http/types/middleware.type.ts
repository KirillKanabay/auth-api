import {IncomingMessage, ServerResponse} from "http";
import {EndpointInfo} from "./endpoint";
import {UserClaims} from "./jwt.type";

export interface MiddlewareContext {
    endpoint?: EndpointInfo,
    urlPathname?: string,
    claims?: UserClaims
}

export type Middleware = (ctx: MiddlewareContext, req: IncomingMessage, res: ServerResponse, next: () => void | Promise<void>) => Promise<void>;