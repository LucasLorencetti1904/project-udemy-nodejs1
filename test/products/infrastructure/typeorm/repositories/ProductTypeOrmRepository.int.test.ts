import { NotFoundError } from "@/common/domain/errors/httpErrors";
import { testingDataSource } from "@/common/infrastructure/typeorm/dataSource";
import ProductModel from "@/products/domain/models/ProductModel";
import productDataBuilder from "@/products/infrastructure/testing/productDataBuilder";
import Product from "@/products/infrastructure/typeorm/entities/Product";
import ProductTypeormRepository from "@/products/infrastructure/typeorm/repositories/ProductTypeormRepository";
import { randomUUID } from "node:crypto";

describe ("ProductTypeormRepository Test.", () => {
    let sut: ProductTypeormRepository;
    let exampleOfProduct: ProductModel;
    let result: ProductModel;

    async function createAndSaveProduct(productData: Product): Promise<ProductModel> {
        const toCreate: ProductModel = testingDataSource.manager.create(Product, productData);
        await testingDataSource.manager.save(toCreate);
        return toCreate;
    }
    
    beforeAll(async () => {
        await testingDataSource.initialize();
    });


    afterAll(async () => {
        await testingDataSource.destroy();
    });

    beforeEach(async () => {
        await testingDataSource.manager.query("DELETE FROM products");
        sut = new ProductTypeormRepository(testingDataSource.getRepository(Product));
        exampleOfProduct = productDataBuilder({});
    });

    describe ("findById", () => {
        it ("should throw NotFoundError when product is not found by id.", async () => {
            await expect (() => sut.findById(randomUUID())).rejects.toBeInstanceOf(NotFoundError);
        });

        it ("should find product by id.", async () => {
            exampleOfProduct = productDataBuilder({ id: randomUUID() });
            const ProductModel: ProductModel =  await createAndSaveProduct(exampleOfProduct);
            result = await sut.findById(ProductModel.id);
            expect (result.id).toBe(ProductModel.id);
        });
    });

    describe ("create & insert", () => {
        it ("should create a new product object.", () => {
            result = sut.create(exampleOfProduct);
            expect (result.name).toEqual(exampleOfProduct.name);
        });

        it ("should insert a product object.", async () => {
            result = await sut.insert(exampleOfProduct);
            expect (result.price).toEqual(exampleOfProduct.price);
        });
    });

    describe ("create & insert", () => {
        it ("should create a new product object.", () => {
            result = sut.create(exampleOfProduct);
            expect (result.name).toEqual(exampleOfProduct.name);
        });

        it ("should insert a product object.", async () => {
            result = await sut.insert(exampleOfProduct);
            expect (result.price).toEqual(exampleOfProduct.price);
        });
    });

    describe ("update", () => {
        const exampleOfUpdatedProduct: ProductModel = { ...exampleOfProduct, name: "New Name "}; 

        it ("should throw NotFoundError when product is not found by id.", async () => {
            await expect (() => sut.update(exampleOfUpdatedProduct))
                .rejects.toBeInstanceOf(NotFoundError);
        });

        it ("should update a existent product.", async () => {
            const existentProduct: ProductModel = await createAndSaveProduct(exampleOfProduct);
            result = await sut.update(exampleOfUpdatedProduct);
            expect (result.name).toBe(existentProduct.name);
        });
    });

    describe ("delete", () => {
        it ("should throw NotFoundError when product is not found by id.", async () => {
            await expect (() => sut.delete(exampleOfProduct.id))
                .rejects.toBeInstanceOf(NotFoundError);
        });

        it ("should delete a existent product.", async () => {
            const existentProduct: ProductModel = await createAndSaveProduct(exampleOfProduct);
            await sut.delete(existentProduct.id);
            const deletedProduct: ProductModel = await testingDataSource.manager.findOneBy(Product, { id: existentProduct.id });
            expect (deletedProduct).toBeNull();
        });
    });
});