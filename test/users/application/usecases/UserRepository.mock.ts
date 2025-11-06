import UserRepository from "@/users/domain/repository/UserRepository";

export default class MockUserRepository implements UserRepository {
    public findById = vi.fn();
    public findByName = vi.fn();
    public findByEmail = vi.fn();
    public create = vi.fn();
    public update = vi.fn();
    public delete = vi.fn();
    public insert = vi.fn();
    public search = vi.fn();
}