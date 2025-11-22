import type RepositorySearchDSL from "@/common/domain/repositories/search/repositorySearcher/RepositorySearchDSL";
import type RepositorySearchResult from "@/common/domain/repositories/search/repositorySearcher/RepositorySearchResult";
import type UserModel from "@/users/domain/models/UserModel";
import type UserTokenModel from "@/users/domain/models/UserTokenModel";
import type UserTokenRepository from "@/users/domain/repositories/userTokenRepository/UserTokenRepository";
import type CreateUserTokenProps from "@/users/domain/repositories/userTokenRepository/CreateUserTokenProps";
import TestingUserFactory from "test/testingTools/testingFactories/TestingUserFactory";
import { randomUUID } from "node:crypto";
import UserTokenTypeormRepository from "@/users/infrastructure/typeorm/repositories/UserTokenTypeormRepository";
import { MockUserRepository, MockRepositoryProvider } from "test/users/domain/repositories/inMemory/UserTokenRepository.mock";
import TestingUserTokenFactory from "test/testingTools/testingFactories/TestingUserTokenFactory";

let sut: UserTokenRepository;
let mockRepoProvider: MockRepositoryProvider<UserTokenModel, CreateUserTokenProps>;
let mockUserRepo: MockUserRepository;

const impls: (new (...args: any) => UserTokenRepository)[] = [
    UserTokenTypeormRepository
];

impls.forEach((Impl) => {
    describe (`${Impl.name} Test.`, () => {
        
        let result: UserTokenModel;
        
        beforeEach (() => {
            mockRepoProvider = new MockRepositoryProvider();
            mockUserRepo = new MockUserRepository();

            sut = new Impl(mockRepoProvider, mockUserRepo);
        });
    
        describe ("generateToken", () => {
            let exampleOfId: string;
            let user: UserModel;

            it ("should use composition method 'findById' to find user by id and 'create' to generate token.", async () => {
                exampleOfId = randomUUID();
                
                user = TestingUserFactory.model({ id: exampleOfId });
        
                mockUserRepo.findById.mockResolvedValue(user);
                mockRepoProvider.create.mockResolvedValue(TestingUserTokenFactory.model({ userId: exampleOfId }))

                result = await sut.generateToken(exampleOfId);
        
                expect (result.userId).toEqual(user.id);
                expect (typeof result.token).toBe("string");

                expect (mockUserRepo.findById).toHaveBeenCalledExactlyOnceWith(exampleOfId);
                expect (mockRepoProvider.create).toHaveBeenCalledExactlyOnceWith({ userId: exampleOfId });
            });

            it ("should use composition method 'findById' and return null if user is not found by id.", async () => {
                exampleOfId = randomUUID();                
        
                mockUserRepo.findById.mockResolvedValue(null);

                result = await sut.generateToken(exampleOfId);
        
                expect (result).toBeNull();

                expect (mockUserRepo.findById).toHaveBeenCalledExactlyOnceWith(exampleOfId);
                expect (mockRepoProvider.create).not.toHaveBeenCalled();
            });
        });
    
        describe ("findByToken", () => {
            let exampleOfToken: string;
            let token: UserTokenModel;

            it ("should use composition method 'findOneBy' to find by token and return it.", async () => {
                exampleOfToken = randomUUID();
                
                token = TestingUserTokenFactory.model({ token: exampleOfToken });
        
                mockRepoProvider.findOneBy.mockResolvedValue(token);

                result = await sut.findByToken(exampleOfToken);
        
                expect (result.token).toEqual(exampleOfToken);

                expect (mockRepoProvider.findOneBy).toHaveBeenCalledExactlyOnceWith("token", exampleOfToken);
            });

            it ("should use composition method 'findOneBy' to find by token and return null if it not found.", async () => {
                exampleOfToken = randomUUID();                
        
                mockRepoProvider.findOneBy.mockResolvedValue(null);

                result = await sut.findByToken(exampleOfToken);
        
                expect (result).toBeNull();

                expect (mockRepoProvider.findOneBy).toHaveBeenCalledExactlyOnceWith("token", exampleOfToken);
            });
        });
    
        describe ("Compositions Test", () => {
            it ("findById", async () => {           
                const input: string = randomUUID();
                const output: UserTokenModel = TestingUserTokenFactory.model({ id: input });         
                mockRepoProvider.findById.mockResolvedValue(output);
                result = await sut.findById(input);
                expect (result).toEqual(output);
                expect (mockRepoProvider.findById).toHaveBeenCalledWith(input);
            });
    
            it ("create", async () => {           
                const input: CreateUserTokenProps = TestingUserTokenFactory.createInput({});
                const output: UserTokenModel = TestingUserTokenFactory.model(input);         
                mockRepoProvider.create.mockResolvedValue(output);
                result = await sut.create(input);
                expect (result).toEqual(output);
                expect (mockRepoProvider.create).toHaveBeenCalledWith(input);
            });
    
            it ("update", async () => {           
                const input: UserTokenModel = TestingUserTokenFactory.model({});
                const output: UserTokenModel = TestingUserTokenFactory.model(input);         
                mockRepoProvider.update.mockResolvedValue(output);
                result = await sut.update(input);
                expect (result).toEqual(output);
                expect (mockRepoProvider.update).toHaveBeenCalledWith(input);
            });
    
            it ("delete", async () => {           
                const input: string = randomUUID();
                const output: UserTokenModel = TestingUserTokenFactory.model({ token: input });         
                mockRepoProvider.delete.mockResolvedValue(output);
                result = await sut.delete(input);
                expect (result).toEqual(output);
                expect (mockRepoProvider.delete).toHaveBeenCalledWith(input);
            });
    
            it ("search", async () => {           
                const input: RepositorySearchDSL<UserTokenModel> = {};
                const output: any = {};         
                mockRepoProvider.search.mockResolvedValue(output);
                const searchResult: RepositorySearchResult<UserTokenModel> = await sut.search(input);
                expect (searchResult).toEqual(output);
                expect (mockRepoProvider.search).toHaveBeenCalledWith(input);
            });
        });
    });
});