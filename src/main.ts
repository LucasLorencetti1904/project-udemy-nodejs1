import CreateProductUseCaseImpl from "./products/application/usecases/impl/CreateProductUseCaseImpl";
import CreateProductController from "./products/infrastructure/http/controllers/CreateProductController";
import ProductTypeormRepository from "./products/infrastructure/typeorm/repositories/ProductTypeormRepository";

export const productRepository: ProductTypeormRepository = new ProductTypeormRepository();

export const createProductUseCase: CreateProductUseCaseImpl = new CreateProductUseCaseImpl(productRepository);
export const createProductController: CreateProductController = new CreateProductController(createProductUseCase);