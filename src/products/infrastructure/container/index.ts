import { container } from "tsyringe";
import type { Repository as baseTypeormRepository } from "typeorm";
import Product from "@/products/infrastructure/typeorm/entities/Product";
import type SearchQueryFormatterConfig from "@/common/domain/search/searchQueryFormatter/SearchQueryFormatterConfig";
import type SearchQueryFormatter from "@/common/domain/search/searchQueryFormatter/SearchQueryFormatter";
import SearchQueryFormatterImpl from "@/common/domain/search/searchQueryFormatter/SearchQueryFormatterImpl";
import ProductTypeormRepository from "@/products/infrastructure/typeorm/repositories/ProductTypeormRepository";
import CreateProductUseCaseImpl from "@/products/application/usecases/createProduct/CreateProductUseCaseImpl";
import GetProductByIdUseCaseImpl from "@/products/application/usecases/getProductById/GetProductByIdUseCaseImpl";
import UpdateProductUseCaseImpl from "@/products/application/usecases/updateProduct/UpdateProductUseCaseImpl";
import DeleteProductByIdUseCaseImpl from "@/products/application/usecases/deleteProductById/DeleteProductByIdUseCaseImpl";
import SearchProductUseCaseImpl from "@/products/application/usecases/searchProduct/SeachProductUseCaseImpl";
import CreateProductController from "@/products/adapters/controllers/CreateProductController";
import GetProductByIdController from "@/products/adapters/controllers/GetProductByIdController";
import UpdateProductController from "@/products/adapters/controllers/UpdateProductController";
import DeleteProductByIdController from "@/products/adapters/controllers/DeleteProductByIdController";
import SearchProductController from "@/products/adapters/controllers/SearchProductController";
import dataSource from "@/common/infrastructure/typeorm/config/dataSource";
import TypeormRepositorySearcher from "@/common/infrastructure/repositories/TypeormRepositorySearcher";
import TypeormRepository from "@/common/infrastructure/repositories/TypeormRepository";
import type RepositoryProvider from "@/common/domain/repositories/RepositoryProvider";
import type CreateProductProps from "@/products/domain/repositories/CreateProductProps";

container.registerInstance<SearchQueryFormatterConfig<Product>>(
    "SearchQueryFormatterConfig<Product>",{
    sortableFields: new Set(["createdAt", "name"]),
    filterableFields: new Set(["name"]),
    defaultProperties: {
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
    }
});

container.registerInstance<SearchQueryFormatter<Product>>(
    "SearchQueryFormatter<Product>",
    new SearchQueryFormatterImpl<Product>(
        container.resolve<SearchQueryFormatterConfig<Product>>("SearchQueryFormatterConfig<Product>")
    )
);

container.registerInstance<baseTypeormRepository<Product>>(
    "DefaultTypeormRepository<Product>",
    dataSource.getRepository(Product)
);

container.registerSingleton<TypeormRepositorySearcher<Product>>(
    "Searcher<Product>",
    TypeormRepositorySearcher<Product>
)

container.registerInstance<RepositoryProvider<Product, CreateProductProps>>(
    "RepositoryProvider<Product>",
    new TypeormRepository<Product>(
        container.resolve("DefaultTypeormRepository<Product>"),
        container.resolve("SearchQueryFormatter<Product>"),
        container.resolve("TypeormRepositorySearcher<Product>")
    )
);

container.registerSingleton("ProductRepository", ProductTypeormRepository);

container.registerSingleton("CreateProductUseCase", CreateProductUseCaseImpl);
container.registerSingleton("CreateProductController", CreateProductController);

container.registerSingleton("GetProductByIdUseCase", GetProductByIdUseCaseImpl);
container.registerSingleton("GetProductByIdController", GetProductByIdController);

container.registerSingleton("UpdateProductUseCase", UpdateProductUseCaseImpl);
container.registerSingleton("UpdateProductController", UpdateProductController);

container.registerSingleton("DeleteProductByIdUseCase", DeleteProductByIdUseCaseImpl);
container.registerSingleton("DeleteProductByIdController", DeleteProductByIdController);

container.registerSingleton("SearchProductUseCase", SearchProductUseCaseImpl);
container.registerSingleton("SearchProductController", SearchProductController);