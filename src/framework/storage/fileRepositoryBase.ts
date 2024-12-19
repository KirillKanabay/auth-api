import {EntityBase} from "./entityBase";
import fs from "fs/promises";

export abstract class FileRepositoryBase<TEntity extends EntityBase>{
    protected readonly FilePath : string;

    constructor(filePath: string) {
        this.FilePath = filePath;
    }

    async getByIdAsync(id: string): Promise<TEntity | undefined>{
        const entities = await this.getAllAsync();
        return entities.find(e => e.id === id);
    }

    async getAllAsync(): Promise<TEntity[]>{
        const serializedData = await fs.readFile(this.FilePath, { encoding:"utf-8" });
        return <TEntity[]>JSON.parse(serializedData);
    }

    async insertAsync(entity: TEntity){
        const entities = await this.getAllAsync();
        entities.push(entity);
        await this.saveAsync(entities);
    }

    async updateAsync(entity: TEntity){
        let entities = await this.getAllAsync();
        const existingEntity = entities.find(e => e.id === entity.id);

        if(existingEntity){
            this.mapEntityFields(entity, existingEntity);
            await this.saveAsync(entities);

            return existingEntity;
        }
    }

    async deleteAsync(id: string){
        let entities = await this.getAllAsync();
        entities = entities.filter(e => e.id !== id);
        await this.saveAsync(entities);
    }

    protected async saveAsync(entities: TEntity[]){
        const serializedData = JSON.stringify(entities);
        await fs.writeFile(this.FilePath, serializedData);
    }

    protected mapEntityFields(src: TEntity, dest: TEntity){
        Object.keys(src).forEach(key => {
            if(key !== 'id' && key in dest){
                (<any>dest)[key] = (<any>src)[key];
            }
        })
    }
}