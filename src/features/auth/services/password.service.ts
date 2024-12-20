import * as bcrypt from 'bcrypt';
import * as crypto from "crypto";

export class PasswordService{
    private static readonly _saltRounds = 10;

    public static hashSHA256(password: string){
        return crypto.createHash('sha256').update(password).digest('hex');
    }

    public static compareSHA256Hash(password: string, hash: string){
        return this.hashSHA256(password) === hash;
    }

    public static async hashPassword(password: string){
        return bcrypt.hash(password, this._saltRounds);
    }

    public static async comparePassword(password: string, hash: string){
        return bcrypt.compare(password, hash);
    }
}