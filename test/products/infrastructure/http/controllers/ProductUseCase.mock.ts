import CreateProductUseCase from "@/products/application/usecases/createProduct/CreateProductUseCase";
import GetProductByIdUseCase from "@/products/application/usecases/getProductById/GetProductByIdUseCase";

export class MockCreateProductUseCase implements CreateProductUseCase {
    public execute = vi.fn();
}

export class MockGetProductByIdUseCase implements GetProductByIdUseCase {
    public execute = vi.fn();
}