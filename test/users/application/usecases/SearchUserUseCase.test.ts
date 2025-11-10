import type SearchUserUseCase from "@/users/application/usecases/searchUser/SearchUserUseCase";
import SearchUserUseCaseImpl from "@/users/application/usecases/searchUser/SearchUserUseCaseImpl";
import { MockUserRepository } from "../../providers.mock";
import type UserModel from "@/users/domain/models/UserModel";
import type { SearchUserInput, SearchUserOutput } from "@/users/application/dto/searchUserIo";
import type { RepositorySearchOutput } from "@/common/domain/repositories/repositorySearchIo";
import TestingUserFactory from "test/users/testingHelpers/TestingUserFactory";
import { InternalError } from "@/common/domain/errors/httpErrors";

describe ("SearchUserUseCase Test", () => {  
    let sut: SearchUserUseCase;
    let mockRepository: MockUserRepository;

    let models: UserModel[] = Array.from({ length: 50 }, () => TestingUserFactory.model({}));
    
    let exampleOfModel: UserModel = TestingUserFactory.model({});

    let defaultRepoOutput: RepositorySearchOutput<UserModel>;
    let repoOutput: RepositorySearchOutput<UserModel>;

    let result: SearchUserOutput;

    beforeEach (() => {
        mockRepository = new MockUserRepository();
        sut = new SearchUserUseCaseImpl(mockRepository);
        
        models = Array.from({ length: 50 }, () => TestingUserFactory.model({ name: "Non" }));

        defaultRepoOutput = {
            currentPage: 1,
            perPage: 15,
            sort: "createdAt",
            sortDir: "desc",
            items: models.slice(24, 32),
            total: models.length,
            filter: ""
        };
    });

    type Case = {
        description: string,
        input: SearchUserInput,
        output: Partial<RepositorySearchOutput<UserModel>>,
        expected: Partial<SearchUserOutput>
    };

    const specificCases: Case[] = [
        {
            description: "should return default pagination values.",
            input: {},
            output: { currentPage: 1, perPage: 15 },
            expected: { currentPage: 1, perPage: 15 }
        },
        {
            description: "should handle with default pagination values when invalid.",
            input: { page: -6, perPage: 9.22 },
            output: { currentPage: 1, perPage: 15 },
            expected: { currentPage: 1, perPage: 15 }
        },
        {
            description: "should return pagination values.",
            input: { page: 4, perPage: 8 },
            output: { currentPage: 4, perPage: 8 },
            expected: { currentPage: 4, perPage: 8 }
        },
        {
            description: "should return the number of last page.",
            input: { perPage: 5 },
            output: { total: 50, perPage: 5 },
            expected: { lastPage: 10 }
        },
        {
            description: "should always return last page 1 when it is 0.",
            input: {},
            output: { total: 0, perPage: 15 },
            expected: { lastPage: 1 }
        },
        {
            description: "should return the first 15 items by default.",
            input: {},
            output: { items: models.slice(0, 15) },
            expected: { items: models.slice(0, 15).map(({ password, ...output }) => output) }
        },
        {
            description: "should return 6 items of page 2.",
            input: { page: 2, perPage: 6 },
            output: { items: models.slice(6, 12) },
            expected: { items: models.slice(6, 12).map(({ password, ...output }) => output) }
        },
        {
            description: "should return the count of all items.",
            input: {},
            output: { total: 50 },
            expected: { total: 50 }
        },
        {
            description: "should return the count of filtered items.",
            input: { filter: "es" },
            output: { total: 2 },
            expected: { total: 2 }
        },
        {
            description: "should return the complex search result.",
            input: {
                page: 2,
                perPage: 25,
                sort: "email",
                sortDir: "asc",
                filter: "am"
            },
            output: {
                currentPage: 2,
                perPage: 25,
                sort: "email",
                sortDir: "asc",
                filter: "am", 
                total: 50,
                items: Array.from({ length: 3 }, () => TestingUserFactory.model({
                    ...exampleOfModel,
                    email: "example@gmail.com"
                }))
            },
            expected: {
                currentPage: 2,
                perPage: 25,
                lastPage: 2,
                total: 50,
                items: Array.from({ length: 3 }, () => TestingUserFactory.model({
                    ...exampleOfModel,
                    email: "example@gmail.com"
                })).map(({ password, ...output }) => output)
            }
        }
    ];

    specificCases.forEach(({ description, input, output, expected }) => {
        it (description, async () => {    
            repoOutput = {
                ...defaultRepoOutput,
                ...output
            };
    
            mockRepository.search.mockResolvedValue(repoOutput);
            
            result = await sut.execute(input);

            expect (result).toEqual(expect.objectContaining(expected));
            expect (mockRepository.search).toHaveBeenCalledExactlyOnceWith(input);
        });
    });

    it ("should throw an InternalError repository throws an unexpected error.", async () => {
        await expect (sut.execute({})).rejects.toBeInstanceOf(InternalError);
        expect (mockRepository.search).toHaveBeenCalledExactlyOnceWith({});
    });
});