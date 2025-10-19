import { NotFoundError } from "@/common/domain/errors/httpErrors";
import InMemoryRepository from "@/common/domain/repositories/InMemoryRepository";
import ProductModel from "@/products/domain/models/ProductModel";
import ProductRepository, { ProductId } from "@/products/domain/repositories/ProductRepository";

export default class ProductInMemoryReposity
extends InMemoryRepository<ProductModel>
implements ProductRepository {
    public sortableFields: string[] = ["name", "createdAt"];

    protected async applyFilter(items: ProductModel[], filter?: string): Promise<ProductModel[]> {
        if (!filter) {
            return items;
        }

        return items.filter((item) => {
            return item.name.toLowerCase().includes(filter.toLowerCase())
        }); 
    }

    public async findByName(name: string): Promise<ProductModel> {
        const product: ProductModel = this.items.find(product => product.name === name);

        if (!product) {
            throw new NotFoundError("Product not found.");
        }

        return product;
    }

    public async findAllByIds(productIds: ProductId[]): Promise<ProductModel[]> {
        const productsSet: Set<ProductId> = new Set(productIds);

        const products: ProductModel[] = this.items.filter(id => {
            return productsSet.has(id);
        });

        if (products.length < 1) {
            throw new NotFoundError("Products not found.");
        }

        return products;
    }

    public async applySort(items: ProductModel[], sort?: string, sortDir?: "asc" | "desc"): Promise<ProductModel[]> {
        return super.applySort(items, sort ?? "createdAt", sortDir ?? "desc");
    }
}