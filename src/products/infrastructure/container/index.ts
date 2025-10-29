import CreateProductUseCaseImpl from "@/products/application/usecases/createProduct/CreateProductUseCaseImpl";
import CreateProductController from "@/products/infrastructure/http/controllers/CreateProductController";
import ProductTypeormRepository from "@/products/infrastructure/typeorm/repositories/ProductTypeormRepository";
import { container } from "tsyringe";
import dataSource from "@/common/infrastructure/typeorm/config/dataSource";
import Product from "@/products/infrastructure/typeorm/entities/Product";
import GetProductByIdUseCaseImpl from "@/products/application/usecases/getProductById/GetProductByIdUseCaseImpl";

container.registerSingleton("ProductRepository", ProductTypeormRepository);
container.registerInstance("ProductDefaultTypeormRepository", dataSource.getRepository(Product));

container.registerSingleton("CreateProductUseCase", CreateProductUseCaseImpl);
container.registerSingleton("CreateProductController", CreateProductController);

container.registerSingleton("GetProductByIdUseCase", GetProductByIdUseCaseImpl);