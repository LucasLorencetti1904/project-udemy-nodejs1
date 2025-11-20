import type SearchUserUseCase from "@/users/application/usecases/searchUser/SearchUserUseCase";
import SearchUserUseCaseImpl from "@/users/application/usecases/searchUser/SearchUserUseCaseImpl";
import { MockUserRepository } from "test/users/UserUseCase.mock";
import type UserModel from "@/users/domain/models/UserModel";
import type { SearchUserInput, SearchUserOutput } from "@/users/application/dto/searchUserIo";
import type RepositorySearchResult from "@/common/domain/search/repositorySearcher/RepositorySearchResult";
import TestingUserFactory from "test/testingTools/testingFactories/TestingUserFactory";
import { InternalError } from "@/common/domain/errors/httpErrors";

const defaultRepoOutput: RepositorySearchResult<UserModel> = {
    items: Array.from({ length: 15 }, () => TestingUserFactory.model({})),
    total: 50,
    pagination: {
        currentPage: 1,
        itemsPerPage: 15,
    },
    sorting: {
        field: "createdAt",
        direction: "desc",
    },
    filter: {
        field: "name",
        value: ""
    }
};

const defaultUseCaseOutput: SearchUserOutput = {
    items: defaultRepoOutput.items.map((item) => TestingUserFactory.output(item)),
    total: 50,
    pagination: {
        currentPage: 1,
        itemsPerPage: 15,
        lastPage: 4
    }
};

describe ("SearchUserUseCase Test", () => {  
    let sut: SearchUserUseCase;
    let mockRepository: MockUserRepository;

    let result: SearchUserOutput;

    beforeEach (() => {
        mockRepository = new MockUserRepository();
        sut = new SearchUserUseCaseImpl(mockRepository);        
    });

    type Case = {
        description: string,
        input: SearchUserInput,
        output: RepositorySearchResult<UserModel>,
        expected: SearchUserOutput
    };

    const specificCases: Case[] = [
        {
            description: "should return default search result when input is empty",
            input: {},
            output: { ...defaultRepoOutput },
            expected: { ...defaultUseCaseOutput }
        },
        {
            description: "should return default search result when input is invalid",
            input: {
                pagination: {
                    pageNumber: -23,
                    itemsPerPage: 2.7
                },
                sorting: {
                    field: "password",
                    direction: "desc"
                },
                filter: {
                    field: "password",
                    value: ""
                }
            },
            output: { ...defaultRepoOutput },
            expected: { ...defaultUseCaseOutput }
        },
        {
            description: "should calculate the last page and return specific search result when input is valid",
            input: {
                pagination: {
                    pageNumber: 3,
                    itemsPerPage: 9
                },
                sorting: {
                    field: "name",
                    direction: "asc"
                },
                filter: {
                    field: "name",
                    value: "exmpl"
                }
            },
            output: {
                total: 50,
                items: [ ...defaultRepoOutput.items.slice(18, 27) ],
                pagination: {
                    currentPage: 3,
                    itemsPerPage: 9
                },
                sorting: {
                    field: "email",
                    direction: "asc"
                },
                filter: {
                    field: "name",
                    value: "exmpl"
                }
            },
            expected: {
                total: 50,
                items: [ ...defaultRepoOutput.items.slice(18, 27) ],
                pagination: {
                    currentPage: 3,
                    itemsPerPage: 9,
                    lastPage: 6
                }
            }
        }
    ];

    specificCases.forEach(({ description, input, output, expected }) => {
        it (description, async () => {        
            mockRepository.search.mockResolvedValue(output);

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