import Product from "@/products/infrastructure/typeorm/entities/Product";
import type ProductModel from "@/products/domain/models/ProductModel";
import type UpdateProductInput from "@/products/application/dto/UpdateProductInput";
import testingDataSource from "@/common/infrastructure/typeorm/config/testingDataSource";
import TestingProductFactory from "test/testingTools/testingFactories/TestingProductFactory";
import { randomUUID } from "node:crypto";
import TypeormRepository from "@/common/infrastructure/repositories/TypeormRepository";
import { MockRepositorySearcher, MockSearchQueryFormatter } from "./TypeormRepository.mock";
import RepositorySearchResult from "@/common/domain/search/repositorySearcher/RepositorySearchResult";
import RepositorySearchinput from "@/common/domain/search/repositorySearcher/RepositorySearchInput";
import RepositorySearchDSL from "@/common/domain/search/repositorySearcher/RepositorySearchDSL";

describe ("TypeormRepository Test.", () => {
    let sut: TypeormRepository<ProductModel>;
    let mockSearcher: MockRepositorySearcher<ProductModel>;
    let mockQueryFormatter: MockSearchQueryFormatter<ProductModel>;

    let exampleOfProduct: ProductModel;
    let result: ProductModel | ProductModel[] | RepositorySearchResult<ProductModel>;

    async function createAndSaveProduct(data: ProductModel): Promise<ProductModel> {
        const toCreate: ProductModel = testingDataSource.manager.create(Product, data);
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
        mockQueryFormatter = new MockSearchQueryFormatter();
        mockSearcher = new MockRepositorySearcher();
        sut = new TypeormRepository(testingDataSource.getRepository(Product), mockQueryFormatter, mockSearcher);
        exampleOfProduct = TestingProductFactory.output({});
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

    describe ("create", () => {
        it ("should create a new product object.", async () => {
            result = await sut.create(exampleOfProduct);
            expect (result.name).toEqual(exampleOfProduct.name);
        });
    });

    describe ("update", () => {
        it ("should return the same model when product is not found by id.", async () => {
            result = await sut.update(exampleOfProduct);
            expect (result).toEqual(exampleOfProduct);
        });

        it ("should update a existent product.", async () => {
            const input: UpdateProductInput = TestingProductFactory.updateInput({ name: "New Name" });
            exampleOfProduct = TestingProductFactory.model({ ...input, name: "Old Name" });
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
        it ("should use composition methods 'formatInput' and 'search' to apply search query and return a search result.", async () => {
            const dsl: RepositorySearchDSL<ProductModel> = {
                pagination: {
                    pageNumber: 1,
                    itemsPerPage: 15
                },
                sorting: {
                    field: "createdAt",
                    direction: "desc"
                },
                filter: {
                    field: "name",
                    value: ""
                }       
            };

            mockQueryFormatter.formatInput.mockReturnValue(dsl);

            const searcherOutput: RepositorySearchResult<ProductModel> = {
                items: Array.from({ length: 15 }),
                total: 50,
                pagination: {
                    currentPage: dsl.pagination.pageNumber,
                    itemsPerPage: dsl.pagination.itemsPerPage
                },
                sorting: {
                    field: dsl.sorting.field,
                    direction: dsl.sorting.direction
                },
                filter: {
                    field: dsl.filter.field,
                    value: dsl.filter.value
                }
            }
            
            mockSearcher.search.mockResolvedValue(searcherOutput);

            const result: RepositorySearchResult<ProductModel> = await sut.search({});

            expect (result).toEqual(searcherOutput);

            expect (mockQueryFormatter.formatInput).toHaveBeenCalledExactlyOnceWith({});
            expect (mockSearcher.search).toHaveBeenCalledExactlyOnceWith(sut["baseTypeormRepository"], dsl);
        });
    });
});