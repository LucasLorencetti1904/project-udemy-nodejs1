import { container } from "tsyringe";
import UserTypeormRepository from "@/users/infrastructure/typeorm/repositories/UserTypeormRepository";
import CreateUserUseCaseImpl from "@/users/application/usecases/createUser/CreateUserUseCaseImpl";
import SearchUserUseCaseImpl from "@/users/application/usecases/searchUser/SearchUserUseCaseImpl";
import AuthenticateUserUseCaseImpl from "@/users/application/usecases/authenticateUser/AuthenticateUserUseCaseImpl";
import UpdateUserAvatarUseCaseImpl from "@/users/application/usecases/updateUserAvatar/UpdateUserAvatarUseCaseImpl";
import CreateUserController from "@/users/infrastructure/http/controllers/CreateUserController";
import SearchUserController from "@/users/infrastructure/http/controllers/SearchUserController";
import AuthenticateUserController from "@/users/infrastructure/http/controllers/AuthenticateUserController";
import UpdateUserAvatarController from "@/users/infrastructure/http/controllers/UpdateUserAvatarController";
import AuthorizationMiddleware from "@/users/infrastructure/http/middlewares/AuthorizationMiddleware";
import MulterAvatarUploadMiddleware from "@/users/infrastructure/http/middlewares/MulterAvatarUploadMiddleware";
import User from "@/users/infrastructure/typeorm/entities/User";
import dataSource from "@/common/infrastructure/typeorm/config/dataSource";

container.registerSingleton("UserRepository", UserTypeormRepository);
container.registerInstance("UserDefaultTypeormRepository", dataSource.getRepository(User));

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