import {FileRepositoryBase} from "../../framework/storage/fileRepositoryBase";
import {AccountModel} from "./types/account.model";
import {ACCOUNT_STORAGE_FILEPATH} from "../../config";

export class AccountRepository extends FileRepositoryBase<AccountModel>{
    constructor() {
        super(ACCOUNT_STORAGE_FILEPATH);
    }

    public async findByLogin(login: string) {
        const accounts = await this.getAllAsync();
        return accounts.find(account => account.login === login);
    }
}