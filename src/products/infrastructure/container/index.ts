import { container } from "tsyringe";
import ProductTypeormRepository from "@/products/infrastructure/typeorm/repositories/ProductTypeormRepository";
import CreateProductUseCaseImpl from "@/products/application/usecases/createProduct/CreateProductUseCaseImpl";
import GetProductByIdUseCaseImpl from "@/products/application/usecases/getProductById/GetProductByIdUseCaseImpl";
import UpdateProductUseCaseImpl from "@/products/application/usecases/updateProduct/UpdateProductUseCaseImpl";
import DeleteProductByIdUseCaseImpl from "@/products/application/usecases/deleteProductById/DeleteProductByIdUseCaseImpl";
import SearchProductUseCaseImpl from "@/products/application/usecases/searchProduct/SeachProductUseCaseImpl";
import CreateProductController from "@/products/infrastructure/http/controllers/CreateProductController";
import GetProductByIdController from "@/products/infrastructure/http/controllers/GetProductByIdController";
import UpdateProductController from "@/products/infrastructure/http/controllers/UpdateProductController";
import DeleteProductByIdController from "@/products/infrastructure/http/controllers/DeleteProductByIdController";
import SearchProductController from "@/products/infrastructure/http/controllers/SearchProductController";
import Product from "@/products/infrastructure/typeorm/entities/Product";
import dataSource from "@/common/infrastructure/typeorm/config/dataSource";

container.registerSingleton("ProductRepository", ProductTypeormRepository);
container.registerInstance("ProductDefaultTypeormRepository", dataSource.getRepository(Product));

container.registerSingleton("CreateProductUseCase", CreateProductUseCaseImpl);
container.registerSingleton("CreateProductController", CreateProductController);

container.registerSingleton("GetProductByIdUseCase", GetProductByIdUseCaseImpl);
container.registerSingleton("GetProductByIdController", GetProductByIdController);

container.registerSingleton("UpdateProductUseCase", UpdateProductUseCaseImpl);
container.registerSingleton("UpdateProductController", UpdateProductController);

container.registerSingleton("DeleteProductByIdUseCase", DeleteProductByIdUseCaseImpl);
container.registerSingleton("DeleteProductByIdController", DeleteProductByIdController);

container.registerSingleton("SearchProductUseCase", SearchProductUseCaseImpl);
container.registerSingleton("SearchProductController", SearchProductController);