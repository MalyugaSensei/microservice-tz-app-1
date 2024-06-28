import { USER_REPOSITORY } from "src/user/constants";
import { User } from "src/user/entities/user.entity";

export const userProviders = [
    {
        provide: USER_REPOSITORY,
        useValue: User,
    },
];