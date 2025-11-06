import { container } from "tsyringe";
import dataSource from "@/common/infrastructure/typeorm/config/dataSource";
import UserTypeormRepository from "@/users/infrastructure/typeorm/repositories/UserTypeormRepository";
import User from "@/users/infrastructure/typeorm/entities/User";
import CreateUserUseCaseImpl from "@/users/application/usecases/createUser/CreateUserUseCaseImpl";
import CreateUserController from "@/users/infrastructure/http/controllers/CreateUserController";

container.registerSingleton("UserRepository", UserTypeormRepository);
container.registerInstance("UserDefaultTypeormRepository", dataSource.getRepository(User));

container.registerSingleton("CreateUserUseCase", CreateUserUseCaseImpl);
container.registerSingleton("CreateUserController", CreateUserController);