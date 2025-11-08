import ProductTypeormRepository from "@/products/infrastructure/typeorm/repositories/ProductTypeormRepository";
import Product from "@/products/infrastructure/typeorm/entities/Product";
import type ProductModel from "@/products/domain/models/ProductModel";
import type UpdateProductInput from "@/products/application/dto/UpdateProductInput";
import type { RepositorySearchOutput } from "@/common/domain/repositories/repositorySearchIo";
import testingDataSource from "@/common/infrastructure/typeorm/config/testingDataSource";
import productModelBuilder from "@/products/infrastructure/testing/productModelBuilder";
import { updateProductInputBuilder } from "@/products/infrastructure/testing/productInputBuilder";
import productOutputBuilder from "@/products/infrastructure/testing/productOutputBuilder";
import { randomUUID } from "node:crypto";

describe ("ProductTypeormRepository Test.", () => {
    let sut: ProductTypeormRepository;
    let exampleOfProduct: ProductModel;
    let result: ProductModel | ProductModel[] | RepositorySearchOutput<ProductModel>;

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
        exampleOfProduct = productOutputBuilder({});
    });

    describe ("findById", () => {
        it ("should return null when product is not found by id.", async () => {
            result = await sut.findById(randomUUID());
            expect (result).toBeNull();
        });

        it ("should find product by id.", async () => {
            const product: ProductModel =  await createAndSaveProduct(exampleOfProduct);
            result = await sut.findById(product.id);

            expect (result.id).toBe(product.id);
        });
    });

    describe ("findAllByIds", () => {
        let products: ProductModel[];

        beforeEach(async () => {
            products = [
                await createAndSaveProduct({ ...exampleOfProduct, id: randomUUID() }),
                await createAndSaveProduct({ ...exampleOfProduct, id: randomUUID() })
            ];
        });

        it ("should return a empty array when no product is found by these ids.", async () => {
            result = await sut.findAllByIds([randomUUID(), randomUUID()]);
            expect (result).toHaveLength(0);
        });

        it ("should return a array of products when they are found by these ids.", async () => {
            result = await sut.findAllByIds([products[1].id, randomUUID()]);
            expect (result).toHaveLength(1);
        });
    });

    describe ("findByName", () => {
        it ("should return null when product is not found by name.", async () => {
            result = await sut.findByName("Fake name");
            expect (result).toBeNull();
        });

        it ("should find product by name.", async () => {
            const product: ProductModel = await createAndSaveProduct(exampleOfProduct);
            result = await sut.findByName(product.name);

            expect (result.name).toBe(product.name);
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
        it ("should return the same model when product is not found by id.", async () => {
            result = await sut.update(exampleOfProduct);
            expect (result).toEqual(exampleOfProduct);
        });

        it ("should update a existent product.", async () => {
            const input: UpdateProductInput = updateProductInputBuilder({ name: "New Name" });
            exampleOfProduct = productModelBuilder({ ...input, name: "Old Name" });
            const oldProduct: ProductModel = await createAndSaveProduct(exampleOfProduct);
            result = await sut.update({ ...oldProduct, ...input });

            expect (result.name).not.toBe(oldProduct.name);
        });
    });

    describe ("delete", () => {
        it ("should return null when product is not found by id.", async () => {
            result = await sut.delete(exampleOfProduct.id);
            expect (result).toBeNull();
        });

        it ("should delete a existent product and return it.", async () => {
            const existentProduct: ProductModel = await createAndSaveProduct(exampleOfProduct);
            result = await sut.delete(existentProduct.id);
            const deletedProduct: ProductModel = await testingDataSource.manager.findOneBy(Product, { id: existentProduct.id });

            expect (!deletedProduct && result.name == existentProduct.name).toBe(true);
        });
    });

    describe ("search", () => {
        let products: ProductModel[];

        async function createAndSaveProducts(productsData: Product[]): Promise<ProductModel[]> {
            const toCreate: ProductModel[] = testingDataSource.manager.create(Product, productsData);
            await testingDataSource.manager.save(toCreate);
            return toCreate;
        }
        
        beforeEach (() => {
            products = [
                productOutputBuilder({ name: "A", createdAt: new Date(2025, 4, 19) }),
                productOutputBuilder({ name: "D", createdAt: new Date(2019, 2, 17) }),
                productOutputBuilder({ name: "C", createdAt: new Date(2024, 7, 23) }),
                productOutputBuilder({ name: "B", createdAt: new Date(2020, 2, 1) })
            ];
        });

        afterEach (() => {
            testingDataSource.manager.clear(Product);
        });

        it ("should apply a default pagination with the first unsorted items when params is not specified.", async () => {
            products = Array.from({ length: 20 }, () => productOutputBuilder({}));
            await createAndSaveProducts(products);
            result = await sut.search({});

            expect (result.items).toHaveLength(15); 
        });
        
        it ("should apply only paginate when other params is null.", async () => {
            products = Array.from({ length: 20 }, () => productOutputBuilder({}));
            await createAndSaveProducts(products);
            result = await sut.search({ page: 3, perPage: 7 });

            expect (result.items).toHaveLength(6); 
        });

        it ("should apply only default desc sort by createdAt when params is null.", async () => {
            await createAndSaveProducts(products);
            result = await sut.search({});

            expect (result.items[3].name).toBe("D"); 
        });

        it ("should apply only asc sort by name when other params is null.", async () => {
            await createAndSaveProducts(products);
            result = await sut.search({ sort: "name", sortDir: "asc" });

            expect (result.items[3].createdAt.getFullYear()).toBe(2019); 
        });
        
        it ("should apply only filter when other params is null.", async () => {
            products = "AB,BC,CA".split(",").map((e) => productOutputBuilder({ name: e }));
            await createAndSaveProducts(products);
            result = await sut.search({ filter: "c" });

            expect (result.items[1].name).toBe("CA");
        });

        it ("should apply all params.", async () => {
            products = "TESTE,tst,fake,test,te".split(",").map((e) => {
                return productOutputBuilder({ name: e });
            });
            await createAndSaveProducts(products);
            
            result = await sut.search({
                page: 1, perPage: 2, sortDir: "asc", sort: "name", filter: "tes"
            });

            expect (result.items[0].name).toBe("test");
        });
    });
});