import dataSource from "@/common/infrastructure/typeorm/config/dataSource";
import { container } from "tsyringe";
import UserTypeormRepository from "@/users/infrastructure/typeorm/repositories/UserTypeormRepository";
import User from "@/users/infrastructure/typeorm/entities/User";

container.registerSingleton("UserRepository", UserTypeormRepository);
container.registerInstance("UserDefaultTypeormRepository", dataSource.getRepository(User));