import {AccountModel} from "../../../features/auth/types/account.model";
import { ACCESS_TOKEN_SECRET_KEY } from "../../../config";
import * as crypto from "crypto";
import {JwtHeader, JwtPayload, UserClaims} from "../types/jwt.type";

export class JwtService{
    public static generateToken(account: AccountModel, lifetimeInSeconds: number, isRefresh?: boolean):string {
        if(!ACCESS_TOKEN_SECRET_KEY){
            throw new Error("Token secret key is not defined!");
        }

        const header = this._toBase64(this._getHeader());
        const payload = this._toBase64(this._getPayload(account, lifetimeInSeconds, isRefresh ?? false));

        const tokenWithoutSignature = `${header}.${payload}`;

        const signature = crypto.createHmac('sha256', ACCESS_TOKEN_SECRET_KEY)
            .update(tokenWithoutSignature)
            .digest('base64url');

        return `${tokenWithoutSignature}.${signature}`;
    }

    public static parse(token: string): UserClaims | null{
        if(!ACCESS_TOKEN_SECRET_KEY){
            throw new Error("Token secret key is not defined!");
        }

        if(!token){
            return null;
        }

        try {
            const [header, payload, signature] = token.split('.');
            const tokenWithoutSignature = `${header}.${payload}`;

            const calculatedSignature = crypto.createHmac('sha256', ACCESS_TOKEN_SECRET_KEY)
                .update(tokenWithoutSignature)
                .digest('base64url');

            if(calculatedSignature !== signature){
                return null;
            }

            return this._parseBase64Url<UserClaims>(payload);
        } catch(e) {
            console.error('Error while verifying token', e);
            return null;
        }
    }

    private static _getHeader() : JwtHeader{
        return {
            alg: 'HS256',
            typ: 'JWT'
        }
    }

    private static _getPayload(account: AccountModel, tokenLifetimeInSeconds: number, isRefresh: boolean): JwtPayload{
        const expDate = Date.now() + tokenLifetimeInSeconds * 1000;
        const payload: JwtPayload = {
            userId: account.id,
            exp: expDate
        };

        if(!isRefresh){
            payload.login = account.login;
        }

        return payload;
    }

    private static _toBase64(obj: any){
        const json = JSON.stringify(obj);
        return Buffer.from(json).toString('base64url');
    }

    private static _parseBase64Url<T>(base64Url: string): T {
        const json = Buffer.from(base64Url, 'base64url').toString();
        return <T>JSON.parse(json);
    }
}