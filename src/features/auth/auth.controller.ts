import {AuthService} from "./services/auth.service";
import {tryParse} from "../../framework/json.utils";
import {badRequest, forbidden, jsonCreated, jsonOk, unauthorized} from "../../framework/http/serverResponse.utils";
import {AsyncRequestListener} from "../../framework/http/types/endpoint";

const authService = new AuthService()

export const signup : AsyncRequestListener = async (req, res) => {
    const parseResult = tryParse<{login: string, password: string}>(req.rawBody);

    if(!parseResult.success){
        return badRequest(res, parseResult.error);
    }
    const {login, password} = parseResult.data!;
    const validationErrors = validateCredentials(login, password);
    if(validationErrors.length > 0){
        return badRequest(res, validationErrors.join('; '));
    }

    const executionResult = await authService.signup(login, password);

    if(!executionResult.isSuccess){
        return badRequest(res, executionResult.errors!.join('; '));
    }

    return jsonCreated(res, 'Account created');
}

export const login: AsyncRequestListener = async (req, res) => {
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

export const refresh : AsyncRequestListener = async (req, res) => {
    const parseResult = tryParse<{refreshToken: string}>(req.rawBody);
    if(!parseResult.success){
        return badRequest(res, parseResult.error);
    }

    const {refreshToken} = parseResult.data!;
    if(!refreshToken) {
        return unauthorized(res, 'Refresh token is required');
    }

    const executionResult = await authService.refresh(refreshToken);
    if(!executionResult.isSuccess){
        return forbidden(res, executionResult.errors!.join('; '));
    }

    return jsonOk(res, executionResult.data);
}

const validateCredentials = (login: string, password: string) => {
    const errors: string[] = [];

    if(!login || typeof login !== 'string'){ errors.push('Login is required or is not string'); }
    if(!password || typeof password !== 'string'){ errors.push('Password is required or is not string'); }

    return errors;
}