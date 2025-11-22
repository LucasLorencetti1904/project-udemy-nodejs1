import type RepositoryProvider from "@/common/domain/repositories/RepositoryProvider";
import type UserRepository from "@/users/domain/repositories/userRepository/UserRepository";

export class MockRepositoryProvider<TModel, TCreateModelProps> implements RepositoryProvider<TModel, TCreateModelProps> {
    public findById = vi.fn();
    public findOneBy = vi.fn();
    public findManyBy = vi.fn();
    public create = vi.fn();
    public update = vi.fn();
    public delete = vi.fn();
    public search = vi.fn();
}

export class MockUserRepository implements UserRepository {
    public findById = vi.fn();
    public findOneBy = vi.fn();
    public findManyBy = vi.fn();
    public create = vi.fn();
    public update = vi.fn();
    public delete = vi.fn();
    public search = vi.fn();
    public findByEmail = vi.fn();
    public findByName = vi.fn();
}