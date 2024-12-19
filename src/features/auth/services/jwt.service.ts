import {AccountModel} from "../types/account.model";
import {ACCESS_TOKEN_LIFETIME, ACCESS_TOKEN_SECRET_KEY} from "../../../config";
import * as crypto from "crypto";

export class JwtService{
    public static generateToken(account: AccountModel):string {
        if(!ACCESS_TOKEN_SECRET_KEY){
            throw new Error("Token secret key is not defined!");
        }

        const header = this._toBase64(this._getHeader());
        const payload = this._toBase64(this._getPayload(account));

        const tokenWithoutSignature = `${header}.${payload}`;

        const signature = crypto.createHmac('sha256', ACCESS_TOKEN_SECRET_KEY)
            .update(tokenWithoutSignature)
            .digest('base64url');

        return `${tokenWithoutSignature}.${signature}`;
    }

    private static _getHeader() : JwtHeader{
        return {
            alg: 'HS256',
            typ: 'JWT'
        }
    }

    private static _getPayload(account: AccountModel): JwtPayload{
        const expDate = Date.now() + ACCESS_TOKEN_LIFETIME * 1000;
        return {
            userId: account.id,
            login: account.login,
            exp: expDate
        }
    }

    private static _toBase64(obj: any){
        const json = JSON.stringify(obj);
        return Buffer.from(json).toString('base64url');
    }
}