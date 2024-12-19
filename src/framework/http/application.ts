import http from 'http';
import {Router} from "./router";
import {internalServerError} from "./serverResponse.utils";
import {BASE_URL} from "../../config";

export class Application{
    private readonly _server;
    private readonly _router: Router;

    constructor(router: Router){
        this._server = this._createServer();
        this._router = router;
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
                const method = req.method as HttpMethod;
                const url = new URL(req.url!, BASE_URL).pathname;

                const endpoint = this._router.findEndpoint(url, method);

                if(endpoint){
                    req.params = endpoint.params;
                    req.rawBody = body;

                    try {
                        await endpoint.handler(req, res);
                    } catch(e) {
                        console.error(e);
                        internalServerError(res);
                    }
                } else {
                    res.statusCode = 404;
                    res.end('Not Found');
                }
            })
        });
    }
}