import CreateProductUseCaseImpl from "@/products/application/usecases/impl/CreateProductUseCaseImpl";
import CreateProductController from "@/products/infrastructure/http/controllers/CreateProductController";
import ProductTypeormRepository from "@/products/infrastructure/typeorm/repositories/ProductTypeormRepository";
import { container } from "tsyringe";

container.registerSingleton("ProductRepository", ProductTypeormRepository);
container.registerSingleton("CreateProductUseCase", CreateProductUseCaseImpl);
container.registerSingleton("CreateProductController", CreateProductController);