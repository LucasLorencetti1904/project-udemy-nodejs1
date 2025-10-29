import { injectable } from "tsyringe";
import InMemoryRepository from "@/common/domain/repositories/InMemoryRepository";
import type ProductModel from "@/products/domain/models/ProductModel";
import type ProductRepository from "@/products/domain/repositories/ProductRepository";

@injectable()
export default class ProductInMemoryRepository
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

    public async applySort(items: ProductModel[], sort?: string, sortDir?: "asc" | "desc"): Promise<ProductModel[]> {
        return super.applySort(items, sort ?? "createdAt", sortDir ?? "desc");
    }
    
    public async findByName(name: string): Promise<ProductModel | null> {
        const product: ProductModel = this.items.find(product => product.name === name);
        
        if (!product) {
            return null;
        }
        
        return product;
    }

    public async findAllByIds(productIds: string[]): Promise<ProductModel[]> {
        return this.items.filter(item => {
            return productIds.includes(item.id);
        });
    }
}