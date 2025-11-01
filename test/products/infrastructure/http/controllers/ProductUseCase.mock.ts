import CreateProductUseCase from "@/products/application/usecases/createProduct/CreateProductUseCase";
import DeleteProductByIdUseCase from "@/products/application/usecases/deleteProductById/DeleteProductByIdUseCase";
import GetProductByIdUseCase from "@/products/application/usecases/getProductById/GetProductByIdUseCase";
import UpdateProductUseCase from "@/products/application/usecases/updateProduct/UpdateProductUseCase";

export class MockCreateProductUseCase implements CreateProductUseCase {
    public execute = vi.fn();
}

export class MockGetProductByIdUseCase implements GetProductByIdUseCase {
    public execute = vi.fn();
}

export class MockUpdateProductUseCase implements UpdateProductUseCase {
    public execute = vi.fn();
}

export class MockDeleteProductByIdUseCase implements DeleteProductByIdUseCase {
    public execute = vi.fn();
}