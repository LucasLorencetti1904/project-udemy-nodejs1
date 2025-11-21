import type UserRepository from "@/users/domain/repositories/userRepository/UserRepository";
import UserInMemoryRepository from "@/users/domain/repositories/userRepository/inMemory/UserInMemoryRepository";
import UserTypeormRepository from "@/users/infrastructure/typeorm/repositories/UserTypeormRepository";
import MockRepositoryProvider from "test/users/adapters/domain/repositories/inMemory/UserRepository.mock";
import type RepositorySearchDSL from "@/common/domain/repositories/search/repositorySearcher/RepositorySearchDSL";
import type RepositorySearchResult from "@/common/domain/repositories/search/repositorySearcher/RepositorySearchResult";
import type UserModel from "@/users/domain/models/UserModel";
import type CreateUserProps from "@/users/domain/repositories/userRepository/CreateUserProps";
import TestingUserFactory from "test/testingTools/testingFactories/TestingUserFactory";
import { randomUUID } from "node:crypto";

let sut: UserRepository;
let mockRepoProvider: MockRepositoryProvider<UserModel, CreateUserProps>;

const impls: (new (...args: any) => UserRepository)[] = [
    UserInMemoryRepository,
    UserTypeormRepository
];

impls.forEach((Impl) => {
    describe (`${Impl.name} Test.`, () => {
    
        let user: UserModel;
    
        let result: UserModel | UserModel[] | RepositorySearchResult<UserModel>;
        
        beforeEach (() => {
            mockRepoProvider = new MockRepositoryProvider();
            sut = new Impl(mockRepoProvider);
        });
    
        describe ("findByEmail", () => {
            it ("should use composition method 'findOneBy' to find by email and return same value from it.", async () => {
                user = TestingUserFactory.model({})
        
                mockRepoProvider.findOneBy.mockResolvedValue(user);
                result = await sut.findByEmail("email@gmail.com");
        
                expect (result).toEqual(user);
                expect (mockRepoProvider.findOneBy).toHaveBeenCalledExactlyOnceWith("email", "email@gmail.com");
            });
        });
    
        describe ("findByName", () => {
            it ("should use composition method 'findManyBy' to find by name and return same values from it.", async () => {
                user = TestingUserFactory.model({})
        
                mockRepoProvider.findManyBy.mockResolvedValue(user);
                result = await sut.findByName("User name");
        
                expect (result).toEqual(user);
                expect (mockRepoProvider.findManyBy).toHaveBeenCalledExactlyOnceWith("name", "User name");
            });
        });
    
        describe ("Compositions Test", () => {
            it ("findById", async () => {           
                const input: string = randomUUID();
                const output: UserModel = TestingUserFactory.model({ id: input });         
                mockRepoProvider.findById.mockResolvedValue(output);
                result = await sut.findById(input);
                expect (result).toEqual(output);
                expect (mockRepoProvider.findById).toHaveBeenCalledWith(input);
            });
    
            it ("create", async () => {           
                const input: CreateUserProps = TestingUserFactory.createInput({});
                const output: UserModel = TestingUserFactory.model(input);         
                mockRepoProvider.create.mockResolvedValue(output);
                result = await sut.create(input);
                expect (result).toEqual(output);
                expect (mockRepoProvider.create).toHaveBeenCalledWith(input);
            });
    
            it ("update", async () => {           
                const input: UserModel = TestingUserFactory.model({});
                const output: UserModel = TestingUserFactory.model(input);         
                mockRepoProvider.update.mockResolvedValue(output);
                result = await sut.update(input);
                expect (result).toEqual(output);
                expect (mockRepoProvider.update).toHaveBeenCalledWith(input);
            });
    
            it ("delete", async () => {           
                const input: string = randomUUID();
                const output: UserModel = TestingUserFactory.model({ id: input });         
                mockRepoProvider.delete.mockResolvedValue(output);
                result = await sut.delete(input);
                expect (result).toEqual(output);
                expect (mockRepoProvider.delete).toHaveBeenCalledWith(input);
            });
    
            it ("search", async () => {           
                const input: RepositorySearchDSL<UserModel> = {};
                const output: any = {};         
                mockRepoProvider.search.mockResolvedValue(output);
                result = await sut.search(input);
                expect (result).toEqual(output);
                expect (mockRepoProvider.search).toHaveBeenCalledWith(input);
            });
        });
    });
});