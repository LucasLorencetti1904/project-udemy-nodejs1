import ProductRepository from "@/products/domain/repositories/ProductRepository";

export default class MockProductRepository implements ProductRepository {
    public findById = vi.fn();
    public findAllByIds = vi.fn();
    public findByName = vi.fn();
    public create = vi.fn();
    public update = vi.fn();
    public delete = vi.fn();
    public insert = vi.fn();
    public search = vi.fn();
}