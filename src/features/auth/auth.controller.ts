import {IncomingMessage, ServerResponse} from "http";
import {AuthService} from "./services/auth.service";
import {tryParse} from "../../framework/json.utils";
import {badRequest, forbidden, jsonCreated, jsonOk} from "../../framework/http/serverResponse.utils";

const authService = new AuthService()

export const signup = async (req: IncomingMessage, res: ServerResponse) => {
    const parseResult = tryParse<{login: string, password: string}>(req.rawBody);

    if(!parseResult.success){
        return badRequest(res, parseResult.error);
    }
    const {login, password} = parseResult.data!;
    const executionResult = await authService.signup(login, password);

    if(!executionResult.isSuccess){
        return badRequest(res, executionResult.errors!.join('; '));
    }

    return jsonCreated(res, 'Account created');
}

export const login = async (req: IncomingMessage, res: ServerResponse) => {
    const parseResult = tryParse<{login: string, password: string}>(req.rawBody);
    if(!parseResult.success){
        return badRequest(res, parseResult.error);
    }

    const {login, password} = parseResult.data!;
    const validationErrors = validateCredentials(login, password);

    if(validationErrors.length > 0){
        return badRequest(res, validationErrors.join('; '));
    }

    const executionResult = await authService.login(login, password);

    if(!executionResult.isSuccess){
        return forbidden(res, executionResult.errors!.join('; '));
    }

    return jsonOk(res, executionResult.data);
}

export const refresh = (req: IncomingMessage, res: ServerResponse) => {

}

const validateCredentials = (login: string, password: string) => {
    const errors: string[] = [];

    if(!login){ errors.push('Login is required'); }
    if(!password){ errors.push('Password is required'); }

    return errors;
}