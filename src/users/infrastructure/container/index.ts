import { container } from "tsyringe";
import type { Repository as BaseTypeormRepository } from "typeorm";
import type RepositoryProvider from "@/common/domain/repositories/RepositoryProvider";
import User from "@/users/infrastructure/typeorm/entities/User";
import type SearchQueryFormatterConfig from "@/common/domain/search/searchQueryFormatter/SearchQueryFormatterConfig";
import type SearchQueryFormatter from "@/common/domain/search/searchQueryFormatter/SearchQueryFormatter";
import SearchQueryFormatterImpl from "@/common/domain/search/searchQueryFormatter/SearchQueryFormatterImpl";
import UserTypeormRepository from "@/users/infrastructure/typeorm/repositories/UserTypeormRepository";
import CreateUserUseCaseImpl from "@/users/application/usecases/createUser/CreateUserUseCaseImpl";
import SearchUserUseCaseImpl from "@/users/application/usecases/searchUser/SearchUserUseCaseImpl";
import AuthenticateUserUseCaseImpl from "@/users/application/usecases/authenticateUser/AuthenticateUserUseCaseImpl";
import UpdateUserAvatarUseCaseImpl from "@/users/application/usecases/updateUserAvatar/UpdateUserAvatarUseCaseImpl";
import CreateUserController from "@/users/adapters/controllers/CreateUserController";
import SearchUserController from "@/users/adapters/controllers/SearchUserController";
import AuthenticateUserController from "@/users/adapters/controllers/AuthenticateUserController";
import UpdateUserAvatarController from "@/users/adapters/controllers/UpdateUserAvatarController";
import AuthorizationMiddleware from "@/users/adapters/middlewares/AuthorizationMiddleware";
import MulterAvatarUploadMiddleware from "@/users/adapters/middlewares/MulterAvatarUploadMiddleware";
import dataSource from "@/common/infrastructure/typeorm/config/dataSource";
import TypeormRepositorySearcher from "@/common/infrastructure/repositories/TypeormRepositorySearcher";
import type CreateUserProps from "@/users/domain/repositories/userRepository/CreateUserProps";
import TypeormRepository from "@/common/infrastructure/repositories/TypeormRepository";

container.registerInstance<SearchQueryFormatterConfig<User>>(
    "SearchQueryFormatterConfig<User>",
    {
        sortableFields: new Set(["createdAt", "name", "email"]),
        filterableFields: new Set(["name"]),
        defaultProperties: {
            pagination: {
                pageNumber: 1,
                itemsPerPage: 15
            },
            sorting: {
                field: "createdAt",
                direction: "desc"
            },
            filter: {
                field: "name",
                value: ""
            }
        }
    }
);

container.registerInstance<SearchQueryFormatter<User>>(
    "SearchQueryFormatter<User>",
    new SearchQueryFormatterImpl<User>(
        container.resolve<SearchQueryFormatterConfig<User>>("SearchQueryFormatterConfig<User>")
    )
);

container.registerInstance<BaseTypeormRepository<User>>(
    "DefaultTypeormRepository<User>",
    dataSource.getRepository(User)
);

container.registerSingleton<TypeormRepositorySearcher<User>>(
    "RepositorySearcher<User>",
    TypeormRepositorySearcher<User>
)

container.registerInstance<RepositoryProvider<User, CreateUserProps>>(
    "RepositoryProvider<User>",
    new TypeormRepository<User>(
        container.resolve("DefaultTypeormRepository<User>"),
        container.resolve("SearchQueryFormatter<User>"),
        container.resolve("TypeormRepositorySearcher<User>")
    )
);

container.registerSingleton("UserRepository", UserTypeormRepository);

container.registerSingleton("CreateUserUseCase", CreateUserUseCaseImpl);
container.registerSingleton("CreateUserController", CreateUserController);

container.registerSingleton("SearchUserUseCase", SearchUserUseCaseImpl);
container.registerSingleton("SearchUserController", SearchUserController);

container.registerSingleton("AuthenticateUserUseCase", AuthenticateUserUseCaseImpl);
container.registerSingleton("AuthenticateUserController", AuthenticateUserController);
container.registerSingleton("AuthenticationMiddleware", AuthorizationMiddleware);

container.registerSingleton("UpdateUserAvatarUseCase", UpdateUserAvatarUseCaseImpl);
container.registerSingleton("UpdateUserAvatarController", UpdateUserAvatarController);
container.registerSingleton("MulterAvatarUploadMiddleware", MulterAvatarUploadMiddleware);