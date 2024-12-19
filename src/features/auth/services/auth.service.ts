import {JwtService} from "./jwt.service";
import {ExecutionResult} from "../../../common/executionResult";
import {AccountRepository} from "../account.repository";
import {v4 as uuidv4 } from "uuid";
import {AccountModel} from "../types/account.model";
import {PasswordService} from "./password.service";

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
            passwordHash: await PasswordService.hashPassword(password)
        }

        await this._accountRepository.insertAsync(account);

        return ExecutionResult.success();
    }

    public async login(login: string, password: string) {
        const existingAccount = await this._accountRepository.findByLogin(login);

        if(!existingAccount || !await PasswordService.comparePassword(password, existingAccount.passwordHash)){
            return ExecutionResult.fail(["Login or password invalid!"]);
        }

        return ExecutionResult.success(JwtService.generateToken(existingAccount));
    }
}