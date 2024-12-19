import {AsyncRequestListener, DynamicEndpoint, Endpoint, EndpointInfo} from "./types/endpoint";

export class Router{
    protected readonly Endpoints: Map<string, Endpoint>;
    protected readonly DynamicEndpoints: DynamicEndpoint[];

    constructor() {
        this.Endpoints = new Map();
        this.DynamicEndpoints = [];
    }

    public addEndpoint(method: HttpMethod, path: string, handler: AsyncRequestListener){
        if(path.includes(':')){
            const { pathRegex, params } = this._createPathRegex(path);

            this.DynamicEndpoints.push({
                pathRegex,
                params,
                method,
                handler
            });

            return;
        }

        if(!this.Endpoints.has(path)){
            this.Endpoints.set(path, {} as Endpoint);
        }

        const endpoint = this.Endpoints.get(path)!;
        endpoint[method] = handler;
    }

    public get(path: string, handler: AsyncRequestListener){
        this.addEndpoint('GET', path, handler);
    }

    public post(path: string, handler: AsyncRequestListener){
        this.addEndpoint('POST', path, handler);
    }

    public put(path: string, handler: AsyncRequestListener){
        this.addEndpoint('PUT', path, handler);
    }

    public delete(path: string, handler: AsyncRequestListener){
        this.addEndpoint('DELETE', path, handler);
    }

    public findEndpoint(path: string, method: HttpMethod) : EndpointInfo | null {
        const endpoint = this.Endpoints.get(path);

        if(endpoint && endpoint[method]){
            return {
                path,
                method,
                handler: endpoint[method]
            };
        }

        const dynamicEndpoint = this.DynamicEndpoints.find(dynamicEndpoint => {
            return dynamicEndpoint.method === method && dynamicEndpoint.pathRegex.test(path);
        });

        if (dynamicEndpoint){
            const matches = path.match(dynamicEndpoint.pathRegex)!;
            const paramValues = matches.slice(1);
            const params = dynamicEndpoint.params.reduce((acc, param, index) => {
                acc[param] = paramValues[index];
                return acc;
            }, {} as Record<string, string>);

            return {
                path,
                method,
                handler: dynamicEndpoint.handler,
                params
            }
        }

        return null;
    }

    protected mergeRoutes(router: Router){
        router.Endpoints.forEach((endpoint, path) => {
            if(!this.Endpoints.has(path)){
                this.Endpoints.set(path, endpoint);
            }
        });
        this.DynamicEndpoints.push(...router.DynamicEndpoints);
    }

    private _createPathRegex(path: string){
        const params: string[] = [];

        const pathRegexString = path.replace(/:([^\/]+)/g, (_, param) => {
            params.push(param);
            return '([^\/]+)';
        });

        return { pathRegex: new RegExp(`^${pathRegexString}$`), params };
    }
}

export class CompositeRouter extends Router{
    public addRouter(router: Router){
        this.mergeRoutes(router);
    }
}