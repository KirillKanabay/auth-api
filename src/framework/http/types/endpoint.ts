import {IncomingMessage, ServerResponse} from "http";

export type AsyncRequestListener = (req: IncomingMessage, res: ServerResponse) => Promise<void>;

export type Endpoint = {
    [method in HttpMethod]: AsyncRequestListener
};

export interface DynamicEndpoint {
    pathRegex: RegExp;
    params: string[];
    method: HttpMethod;
    handler: AsyncRequestListener;
}

export interface EndpointInfo{
    method: HttpMethod,
    path: string,
    handler: AsyncRequestListener,
    params?: Record<string, string>
}