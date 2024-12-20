import {EntityBase} from "../../../framework/storage/entityBase";

export interface AccountModel extends EntityBase{
    login: string;
    passwordHash: string;
    refreshTokenHash?: string;
}