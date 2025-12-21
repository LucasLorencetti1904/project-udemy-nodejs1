import Product from "@/products/infrastructure/typeorm/entities/Product";
import type ProductModel from "@/products/domain/models/ProductModel";
import type RepositorySearchResult from "@/common/domain/repositories/search/repositorySearcher/RepositorySearchResult";
import type { Repository } from "typeorm";
import testingDataSource from "@/common/infrastructure/typeorm/config/testingDataSource";
import TestingProductFactory from "test/testingTools/testingFactories/TestingProductFactory";
import RepositorySearchDSL, { RepositorySearchDSLFilter, RepositorySearchDSLPagination, RepositorySearchDSLSorting } from "@/common/domain/repositories/search/repositorySearcher/RepositorySearchDSL";
import TypeormRepositorySearcher from "@/common/infrastructure/repositories/TypeormRepositorySearcher";

    describe ("TypeormRepositorySearcher Test", () => {
        let sut: TypeormRepositorySearcher<ProductModel>;

        let paginationExample: RepositorySearchDSLPagination;
        let sortingExample: RepositorySearchDSLSorting<ProductModel>;
        let filterExample: RepositorySearchDSLFilter<ProductModel>;

        let queryExample: RepositorySearchDSL<ProductModel>;

        let result: RepositorySearchResult<ProductModel>;

        let products: ProductModel[];

        const defaultSearchDSL: RepositorySearchDSL<ProductModel> = {
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

        let typeormRepo: Repository<Product>; 

        async function createAndSaveProducts(productsData: Product[]): Promise<ProductModel[]> {
            const toCreate: ProductModel[] = testingDataSource.manager.create(Product, productsData);
            await testingDataSource.manager.save(toCreate);
            return toCreate;
        }

        beforeAll (async () => {
            await testingDataSource.initialize();
        });

        beforeEach (async () => {
            sut = new TypeormRepositorySearcher();
            typeormRepo = testingDataSource.getRepository(Product);

            products = [
                TestingProductFactory.model({ name: "A", createdAt: new Date(2025, 4, 19) }),
                TestingProductFactory.model({ name: "D", createdAt: new Date(2019, 2, 17) }),
                TestingProductFactory.model({ name: "C", createdAt: new Date(2024, 7, 23) }),
                TestingProductFactory.model({ name: "B", createdAt: new Date(2020, 2, 1) })
            ];

            await testingDataSource.manager.clear(Product);
        });

        afterAll (async () => {
            await testingDataSource.destroy();
        });

        it ("should apply a default pagination with the first unsorted items when params is not specified.", async () => {
            products = Array.from({ length: 20 }, () => TestingProductFactory.model({}));
            await createAndSaveProducts(products);

            result = await sut.search(typeormRepo, defaultSearchDSL);

            expect (result.items).toHaveLength(15); 
        });
        
        it ("should apply only paginate when other params is null.", async () => {
            products = Array.from({ length: 20 }, () => TestingProductFactory.model({}));
            await createAndSaveProducts(products);
            
            paginationExample = {
                pageNumber: 3,
                itemsPerPage: 7
            }

            result = await sut.search(typeormRepo, {
                ...defaultSearchDSL,
                pagination: paginationExample
            });

            expect (result.items).toHaveLength(6); 
        });

        it ("should apply only default desc sort by createdAt when params is null.", async () => {
            await createAndSaveProducts(products);
            
            result = await sut.search(typeormRepo, defaultSearchDSL);

            expect (result.items[3].name).toBe("D"); 
        });

        it ("should apply only asc sort by name when other params is null.", async () => {
            await createAndSaveProducts(products);

            sortingExample = {
                field: "name",
                direction: "asc"
            };

            result = await sut.search(typeormRepo, {
                ...defaultSearchDSL,
                sorting: sortingExample
            });

            expect (result.items[3].createdAt.getFullYear()).toBe(2019); 
        });
        
        it ("should apply only filter by name when other params is null.", async () => {
            products = "AB,BC,CA".split(",").map((e) => TestingProductFactory.model({ name: e }));
            await createAndSaveProducts(products);

            filterExample = {
                field: "name",
                value: "c"
            };

            result = await sut.search(typeormRepo, {
                ...defaultSearchDSL,
                filter: filterExample
            });

            expect (result.items[1].name).toBe("CA");
        });

        it ("should apply all params.", async () => {
            products = "TESTE,tst,fake,test,te".split(",").map((e) => TestingProductFactory.model({ name: e }));
            await createAndSaveProducts(products);
            
            queryExample = {
                pagination: {
                    pageNumber: 1,
                    itemsPerPage: 2
                },
                sorting: {
                    field: "name",
                    direction: "asc"
                },
                filter: {
                    field: "name",
                    value: "tes"
                }
            };

            result = await sut.search(typeormRepo, queryExample);

            expect (result.items[0].name).toBe("test");
        });
    });