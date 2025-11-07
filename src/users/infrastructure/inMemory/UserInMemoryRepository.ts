import { injectable } from "tsyringe";
import InMemoryRepository from "@/common/domain/repositories/InMemoryRepository";
import type UserModel from "@/users/domain/models/UserModel";
import UserRepository from "@/users/domain/repositories/UserRepository";

@injectable()
export default class UserInMemoryRepository
extends InMemoryRepository<UserModel>
implements UserRepository {
    public sortableFields: string[] = ["name", "email", "createdAt"];

    protected async applyFilter(items: UserModel[], filter?: string): Promise<UserModel[]> {
        if (!filter) {
            return items;
        }

        return items.filter((item) => {
            return item.name.toLowerCase().includes(filter.toLowerCase())
        }); 
    }

    public async applySort(items: UserModel[], sort?: keyof UserModel, sortDir?: "asc" | "desc"): Promise<UserModel[]> {
        return super.applySort(items, sort ?? "createdAt", sortDir ?? "desc");
    }
    
    public async findByName(name: string): Promise<UserModel[]> {
        return this.items.filter(user => user.name === name);
    }

    public async findByEmail(email: string): Promise<UserModel | null> {
        const user: UserModel = this.items.find((item) => item.email === email);

        if (!user) {
            return null;
        }

        return user;
    }
}