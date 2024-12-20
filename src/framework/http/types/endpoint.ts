import {IncomingMessage, ServerResponse} from "http";

export type AsyncRequestListener = (req: IncomingMessage, res: ServerResponse) => Promise<void>;

export type Endpoint = {
    [method in HttpMethod]: EndpointInfoBase
};

export interface DynamicEndpoint extends EndpointInfoBase {
    pathRegex: RegExp;
    params: string[];
    method: HttpMethod;
    handler: AsyncRequestListener;
}

export interface EndpointInfo extends EndpointInfoBase {
    method: HttpMethod,
    path: string,
    handler: AsyncRequestListener,
    params?: Record<string, string>
}

export interface EndpointInfoBase {
    handler: AsyncRequestListener,
    options?: EndpointOptions
}

export interface EndpointOptions {
    authorized?: boolean;
}