import type ProductRepository from "@/products/domain/repositories/ProductRepository";
import ProductInMemoryRepository from "@/products/infrastructure/inMemory/ProductInMemoryRepository";
import ProductTypeormRepository from "@/products/infrastructure/typeorm/repositories/ProductTypeormRepository";
import MockRepositoryProvider from "test/products/infrastructure/repositories/ProductRepository.mock";
import type RepositorySearchinput from "@/common/domain/search/repositorySearcher/RepositorySearchInput";
import type RepositorySearchResult from "@/common/domain/search/repositorySearcher/RepositorySearchResult";
import type ProductModel from "@/products/domain/models/ProductModel";
import type CreateProductProps from "@/products/domain/repositories/CreateProductProps";
import TestingProductFactory from "test/testingTools/testingFactories/TestingProductFactory";
import { randomUUID } from "node:crypto";

let sut: ProductRepository;
let mockRepoProvider: MockRepositoryProvider<ProductModel, CreateProductProps>;

const impls: (new (...args: any) => ProductRepository)[] = [
    ProductInMemoryRepository,
    ProductTypeormRepository
];

impls.forEach((Impl) => {
    describe (`${Impl.name} Test.`, () => {
    
        let product: ProductModel;
        let products: ProductModel[];
    
        let result: ProductModel | ProductModel[] | RepositorySearchResult<ProductModel>;
        
        beforeEach (() => {
            mockRepoProvider = new MockRepositoryProvider();
            sut = new Impl(mockRepoProvider);
        });
    
        describe ("findByName", () => {
            it ("should use composition method 'findOneBy' to find by name and return same value from it.", async () => {
                product = TestingProductFactory.model({})
        
                mockRepoProvider.findOneBy.mockResolvedValue(product);
                result = await sut.findByName("Product name");
        
                expect (result).toEqual(product);
                expect (mockRepoProvider.findOneBy).toHaveBeenCalledExactlyOnceWith("name", "Product name");
            });
        });
    
        describe ("findAllByIds", () => {
            it ("should use composition method 'findById' to find each id and return same value from it.", async () => {
                products = [TestingProductFactory.model({})];
    
                let ids: string[] = [products[0].id, randomUUID()];
    
                mockRepoProvider.findById.mockResolvedValueOnce(products[0]);
                mockRepoProvider.findById.mockResolvedValueOnce(null);
                result = await sut.findAllByIds(ids);
    
                expect (result).toEqual(products);
                expect (mockRepoProvider.findById).toHaveBeenCalledWith(ids[0]);
                expect (mockRepoProvider.findById).toHaveBeenCalledTimes(ids.length);
            });
        });
    
        describe ("Compositions Test", () => {
            it ("findById", async () => {           
                const input: string = randomUUID();
                const output: ProductModel = TestingProductFactory.model({ id: input });         
                mockRepoProvider.findById.mockResolvedValue(output);
                result = await sut.findById(input);
                expect (result).toEqual(output);
                expect (mockRepoProvider.findById).toHaveBeenCalledWith(input);
            });
    
            it ("create", async () => {           
                const input: CreateProductProps = TestingProductFactory.createInput({});
                const output: ProductModel = TestingProductFactory.model(input);         
                mockRepoProvider.create.mockResolvedValue(output);
                result = await sut.create(input);
                expect (result).toEqual(output);
                expect (mockRepoProvider.create).toHaveBeenCalledWith(input);
            });
    
            it ("update", async () => {           
                const input: ProductModel = TestingProductFactory.model({});
                const output: ProductModel = TestingProductFactory.model(input);         
                mockRepoProvider.update.mockResolvedValue(output);
                result = await sut.update(input);
                expect (result).toEqual(output);
                expect (mockRepoProvider.update).toHaveBeenCalledWith(input);
            });
    
            it ("delete", async () => {           
                const input: string = randomUUID();
                const output: ProductModel = TestingProductFactory.model({ id: input });         
                mockRepoProvider.delete.mockResolvedValue(output);
                result = await sut.delete(input);
                expect (result).toEqual(output);
                expect (mockRepoProvider.delete).toHaveBeenCalledWith(input);
            });
    
            it ("search", async () => {           
                const input: RepositorySearchinput<ProductModel> = {};
                const output: any = {};         
                mockRepoProvider.search.mockResolvedValue(output);
                result = await sut.search(input);
                expect (result).toEqual(output);
                expect (mockRepoProvider.search).toHaveBeenCalledWith(input);
            });
        });
    });
});