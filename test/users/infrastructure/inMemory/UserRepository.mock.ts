import type RepositoryProvider from "@/common/domain/repositories/RepositoryProvider";

export default class MockRepositoryProvider<TModel, TCreateModelProps> implements RepositoryProvider<TModel, TCreateModelProps> {
    public findById = vi.fn();
    public findOneBy = vi.fn();
    public findManyBy = vi.fn();
    public create = vi.fn();
    public update = vi.fn();
    public delete = vi.fn();
    public search = vi.fn();
}