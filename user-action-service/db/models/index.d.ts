import { Model, Sequelize } from "sequelize";

type ModelStatic<TModel extends Model> = typeof Model & {
    new(): TModel;
};

export interface ModelWithAssociations<TModel extends Model> {
    associate: (models: any) => void;
}

export interface dbModels {
    sequelize: Sequelize | null
    [modelName: string]: ModelStatic<Model> & ModelWithAssociations<Model>
}

declare const db: dbModels
export = db;