import type ProductRepository from "@/products/domain/repositories/ProductRepository";
import type SearchQueryFormatterProvider from "@/common/domain/search/searchQueryFormatter/SearchQueryFormatterProvider";

export class MockProductRepository implements ProductRepository {
    public findById = vi.fn();
    public findAllByIds = vi.fn();
    public findByName = vi.fn();
    public create = vi.fn();
    public update = vi.fn();
    public delete = vi.fn();
    public insert = vi.fn();
    public search = vi.fn();
}

export class MockSearchQueryFormatter<TModel> implements SearchQueryFormatterProvider<TModel> {
    public formatInput = vi.fn();
}