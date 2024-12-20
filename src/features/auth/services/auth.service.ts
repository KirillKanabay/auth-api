import {JwtService} from "../../../framework/http/services/jwt.service";
import {ExecutionResult} from "../../../common/executionResult";
import {AccountRepository} from "../account.repository";
import {v4 as uuidv4} from "uuid";
import {AccountModel} from "../types/account.model";
import {PasswordService} from "./password.service";
import {ACCESS_TOKEN_LIFETIME, REFRESH_TOKEN_LIFETIME} from "../../../config";
import {TokenModel} from "../types/token.model";

export class AuthService {
    private readonly _accountRepository: AccountRepository;

    constructor() {
        this._accountRepository = new AccountRepository();
    }

    public async signup(login: string, password: string) {
        const existingAccount = await this._accountRepository.findByLogin(login);

        if(existingAccount){
            return ExecutionResult.fail(["Account with this login already exists!"]);
        }

        const account : AccountModel = {
            id: uuidv4(),
            login,
            passwordHash: await PasswordService.hashPassword(password),
            refreshTokenHash: ''
        }

        await this._accountRepository.insertAsync(account);

        return ExecutionResult.success();
    }

    public async login(login: string, password: string) {
        const existingAccount = await this._accountRepository.findByLogin(login);

        if(!existingAccount || !await PasswordService.comparePassword(password, existingAccount.passwordHash)){
            return ExecutionResult.fail(["Login or password invalid!"]);
        }

        return ExecutionResult.success(await this._generateTokens(existingAccount));
    }

    public async refresh(refreshToken: string) {
        const userClaims = JwtService.parse(refreshToken);

        if(!userClaims){
            return ExecutionResult.fail(["Invalid refresh token"]);
        }

        const existingAccount = await this._accountRepository.getByIdAsync(userClaims.userId);

        if(!existingAccount ||
            !existingAccount.refreshTokenHash ||
            !await PasswordService.comparePassword(refreshToken, existingAccount.refreshTokenHash) ||
            userClaims.exp < Date.now()
        ){
            return ExecutionResult.fail(["Invalid refresh token"]);
        }

        return ExecutionResult.success(await this._generateTokens(existingAccount));
    }

    private async _generateTokens(account: AccountModel) : Promise<TokenModel> {
        const accessToken = JwtService.generateToken(account, ACCESS_TOKEN_LIFETIME);
        const refreshToken = JwtService.generateToken(account, REFRESH_TOKEN_LIFETIME, true);

        account.refreshTokenHash = await PasswordService.hashPassword(refreshToken);

        await this._accountRepository.updateAsync(account);

        return {accessToken, refreshToken};
    }
}