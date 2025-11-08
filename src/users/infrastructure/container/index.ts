import { container } from "tsyringe";
import dataSource from "@/common/infrastructure/typeorm/config/dataSource";
import UserTypeormRepository from "@/users/infrastructure/typeorm/repositories/UserTypeormRepository";
import User from "@/users/infrastructure/typeorm/entities/User";
import CreateUserUseCaseImpl from "@/users/application/usecases/createUser/CreateUserUseCaseImpl";
import CreateUserController from "@/users/infrastructure/http/controllers/CreateUserController";
import SearchUserUseCaseImpl from "@/users/application/usecases/searchUser/SearchUserUseCaseImpl";
import SearchUserController from "@/users/infrastructure/http/controllers/SearchUserController";
import AuthenticateUserUseCaseImpl from "@/users/application/usecases/authenticateUser/AuthenticateUserUseCaseImpl";

container.registerSingleton("UserRepository", UserTypeormRepository);
container.registerInstance("UserDefaultTypeormRepository", dataSource.getRepository(User));

container.registerSingleton("CreateUserUseCase", CreateUserUseCaseImpl);
container.registerSingleton("CreateUserController", CreateUserController);

container.registerSingleton("SearchUserUseCase", SearchUserUseCaseImpl);
container.registerSingleton("SearchUserController", SearchUserController);

container.registerSingleton("AuthenticateUserUseCase", AuthenticateUserUseCaseImpl);