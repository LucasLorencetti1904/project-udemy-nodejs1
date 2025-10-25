import { NotFoundError } from "@/common/domain/errors/httpErrors";
import { dataSource, testingDataSource } from "@/common/infrastructure/typeorm/dataSource";
import ProductModel from "@/products/domain/models/ProductModel";
import productDataBuilder from "@/products/infrastructure/testing/productDataBuilder";
import Product from "@/products/infrastructure/typeorm/entities/Product";
import ProductTypeormRepository from "@/products/infrastructure/typeorm/repositories/ProductTypeormRepository";
import { randomUUID } from "node:crypto";

describe ("ProductTypeormRepository Test.", () => {
    let sut: ProductTypeormRepository;
    let exampleOfProduct: Product;
    let result: Product;
    
    beforeAll(async () => {
        await testingDataSource.initialize();
    });


    afterAll(async () => {
        await testingDataSource.destroy();
    });

    beforeEach(async () => {
        await testingDataSource.manager.query("DELETE FROM products");
        sut = new ProductTypeormRepository(testingDataSource.getRepository(Product));
    });

    describe ("findById", () => {
        it ("should throw NotFoundError when product is not found by id.", async () => {
            await expect (() => sut.findById(randomUUID())).rejects.toBeInstanceOf(NotFoundError);
        });

        it ("should find product by id.", async () => {
            exampleOfProduct = productDataBuilder({ id: randomUUID() });
            const product: ProductModel = testingDataSource.manager.create(Product, exampleOfProduct);
            await testingDataSource.manager.save(product);
            result = await sut.findById(product.id);
            expect (result.id).toBe(product.id);
        });
    });
});