import {ServerResponse} from "http";

export const jsonOk = (res: ServerResponse, data: any)=> {
    res.writeHead(200, {
        'content-type' : 'application/json'
    });
    res.end(JSON.stringify(data));
}

export const jsonCreated = (res: ServerResponse, message: string | null = null, data: any) => {
    res.writeHead(201, {
        'content-type' : 'application/json'
    });

    message ??= 'Entity created';

    res.end(JSON.stringify({
        message: message,
        createdEntity: data
    }));
}

export const notFound = (res: ServerResponse, message: string | null = null)=> {
    res.writeHead(404, {
        'content-type' : 'application/json'
    });

    message ??= 'Not found!'

    res.end(JSON.stringify({error : message}));
}

export const badRequest = (res: ServerResponse, message: string | null = null) => {
    res.writeHead(400, {
        'content-type' : 'application/json'
    });

    message ??= 'Bad request!';

    res.end(JSON.stringify({error : message}));
}

export const noContent = (res: ServerResponse) => {
    res.writeHead(204);
    res.end();
}

export const internalServerError = (res: ServerResponse, message: string | null = null) => {
    res.writeHead(500, {
        'content-type' : 'application/json'
    });

    message ??= 'Internal server error';

    res.end(JSON.stringify({error : message}));
}