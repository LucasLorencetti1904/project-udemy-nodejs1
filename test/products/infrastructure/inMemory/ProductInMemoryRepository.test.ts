import { NotFoundError } from "@/common/domain/errors/httpErrors";
import ProductModel from "@/products/domain/models/ProductModel";
import ProductInMemoryRepository from "@/products/infrastructure/inMemory/ProductInMemoryRepository";
import productDataBuilder from "@/products/infrastructure/testing/productDataBuilder";
import { randomUUID } from "node:crypto";

describe ("ProductInMemoryRepository Test.", () => {
    let sut: ProductInMemoryRepository;
    let result: ProductModel | ProductModel[];
    
    beforeEach(() => {
        sut = new ProductInMemoryRepository();
    });

    describe ("findByName", () => {
        it ("should throw NotFoundError when product is not found.", async () => {
            await expect (() => sut.findByName("Fake Name")).rejects.toBeInstanceOf(NotFoundError);
        });

        it ("should return a product when it is found by name.", async () => {
            const exampleOfProduct: ProductModel = productDataBuilder({ name: "Valid Name Example" });
            sut.items.push(exampleOfProduct);
            result = await sut.findByName("Valid Name Example");
            expect (result).toEqual(exampleOfProduct);
        });
    });

    describe ("findAllByIds", () => {
        it ("should return an empty array when no product is found by id.", async () => {
            result = await sut.findAllByIds([randomUUID(), randomUUID()]);
            expect (result).toEqual([]);
        });
        
        it ("should return an array of products when it is found by id.", async () => {
            const randomIds: string[] = [randomUUID(), randomUUID()];
            sut.items = [
                productDataBuilder({ id: randomIds[0] }),
                productDataBuilder({ id: randomIds[1] })
            ];
            result = await sut.findAllByIds([randomIds[1], randomUUID()]);
            expect (result).toEqual([sut.items[1]]);
        });
    });

    describe ("applySort", () => {
        beforeEach (() => {    
            sut.items = [
                productDataBuilder({ name: "b", createdAt: new Date(2024, 8, 12) }),
                productDataBuilder({ name: "a", createdAt: new Date(2025, 10, 19) }),
                productDataBuilder({ name: "c", createdAt: new Date(2025, 2, 29) })
            ];
        });

        let sortedModels: ProductModel[];

        it ("should sort items by createdAt using desc order when sort and sortDir params is null.", async () => {
            sortedModels = await sut['applySort'](sut.items);
            expect (sortedModels).toEqual([sut.items[1], sut.items[2], sut.items[0]]);
        });

        it ("should no sort items when sort param is not sortable field.", async () => {
            sortedModels = await sut['applySort'](sut.items, "id", "asc");
            expect (sortedModels).toEqual(sut.items);
        });

        it ("should sort items by createdAt using asc order.", async () => {
            sortedModels = await sut['applySort'](sut.items, null, "asc");
            expect (sortedModels).toEqual([sut.items[0], sut.items[2], sut.items[1]]);
        });

        it ("should sort items by name using desc order.", async () => {
            sortedModels = await sut['applySort'](sut.items, "name", "desc");
            expect (sortedModels).toEqual([sut.items[2], sut.items[0], sut.items[1]]);
        });
    });

    describe ("applyFilter", () => {
        beforeEach (() => {
            sut.items = [
                productDataBuilder({ name: "test name" }),
                productDataBuilder({ name: "TEST NAME" }),
                productDataBuilder({ name: "fake name"})
            ];
        });

        let filteredModels: ProductModel[];

        it ("should no filter items when filter param is null.", async () => {
            filteredModels = await sut['applyFilter'](sut.items);
            expect (filteredModels).toEqual(sut.items);
        });

        it ("should filter items using filter param.", async () => {
            filteredModels = await sut['applyFilter'](sut.items, "TES");
            expect (filteredModels).toEqual([sut.items[0], sut.items[1]]);
        });

        it ("should return a empty array when filter does not matches.", async () => {
            filteredModels = await sut['applyFilter'](sut.items, "truthy name");
            expect (filteredModels).toHaveLength(0);
        });
    });
});