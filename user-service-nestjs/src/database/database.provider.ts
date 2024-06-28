
import { Sequelize } from "sequelize-typescript";
import { SEQUELIZE } from "src/database/constants";
import { User } from "src/user/entities/user.entity";
import { createNamespace } from 'cls-hooked'

const namespace = createNamespace('nesjs-namespace');

export const databaseProviders = [
    {
        provide: SEQUELIZE,
        useFactory: async () => {
            if (!process.env.DATABASE_URL) {
                throw new Error('Environment variable DATABASE_URL does not set');
            }

            Sequelize.useCLS(namespace);
            const sequelize = new Sequelize(process.env.DATABASE_URL, {
                pool: {
                    max: 10,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                }
            });;
            sequelize.addModels([User]);
            return sequelize;
        },
    },
];