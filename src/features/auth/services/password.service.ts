import * as bcrypt from 'bcrypt';

export class PasswordService{
    private static readonly _saltRounds = 10;

    public static async hashPassword(password: string){
        return bcrypt.hash(password, this._saltRounds);
    }

    public static async comparePassword(password: string, hash: string){
        return bcrypt.compare(password, hash);
    }
}