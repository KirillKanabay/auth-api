import http, {IncomingMessage, ServerResponse} from 'http';
import {Middleware, MiddlewareContext} from "./types/middleware.type";

export class Application{
    private readonly _server;
    private readonly _middlewares: Middleware[];

    constructor(){
        this._server = this._createServer();
        this._middlewares = [];
    }

    public use(middleware: Middleware){
        this._middlewares.push(middleware);
    }

    public listen(port: number, callback?: () => void){
        this._server.listen(port, callback);
    }

    private _createServer(){
        return http.createServer((req, res) => {
            let body = '';

            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('end', async () => {
                req.rawBody = body;
                await this._runMiddlewarePipeline(req, res);
            })
        });
    }

    private async _runMiddlewarePipeline(req: IncomingMessage, res: ServerResponse){
        const ctx: MiddlewareContext = {};

        const runMiddleware = async (idx: number) => {
            if(idx === this._middlewares.length) return;
            return this._middlewares[idx](ctx, req, res, (): Promise<void> => runMiddleware(idx + 1));
        }

        await runMiddleware(0);

        return ctx;
    }
}