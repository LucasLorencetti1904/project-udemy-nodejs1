import type SearchUserUseCase from "@/users/application/usecases/searchUser/SearchUserUseCase";
import SearchUserUseCaseImpl from "@/users/application/usecases/searchUser/SearchUserUseCaseImpl";
import { MockUserRepository, MockQuerySearchFormatter } from "test/users/application/usecases/UserUseCase.mock";
import type UserModel from "@/users/domain/models/UserModel";
import type { SearchUserInput, SearchUserOutput } from "@/users/application/dto/userDto/searchUserIo";
import type RepositorySearchResult from "@/common/domain/repositories/search/repositorySearcher/RepositorySearchResult";
import TestingUserFactory from "test/testingTools/testingFactories/TestingUserFactory";
import { InternalError } from "@/common/domain/errors/httpErrors";
import RepositorySearchDSL from "@/common/domain/repositories/search/repositorySearcher/RepositorySearchDSL";

const defaultFormattedDSL: RepositorySearchDSL<UserModel> = {
    pagination: {
        pageNumber: 1,
        itemsPerPage: 15
    },
    sorting: {
        field: "createdAt",
        direction: "desc"
    },
    filter: {
        field: "name",
        value: ""
    }
};

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
    items: defaultRepoOutput.items.map((item) => {
        const { password, ...rest } = item;
        return rest;
    }),
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
    let mockQueryFormatter: MockQuerySearchFormatter<UserModel>;

    let result: SearchUserOutput;

    beforeEach (() => {
        mockRepository = new MockUserRepository();
        mockQueryFormatter = new MockQuerySearchFormatter();        
        sut = new SearchUserUseCaseImpl(mockRepository, mockQueryFormatter);
    });

    type Case = {
        description: string,
        input: SearchUserInput,
        queryFormatterOutput: RepositorySearchDSL<UserModel>,
        repoOutput: RepositorySearchResult<UserModel>,
        expected: SearchUserOutput
    };

    const specificCases: Case[] = [
        {
            description: "should return default search result when input is empty",
            input: {},
            queryFormatterOutput: { ...defaultFormattedDSL },
            repoOutput: { ...defaultRepoOutput },
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
                    field: "quantity",
                    direction: "desc"
                },
                filter: {
                    field: "id",
                    value: ""
                }
            },
            queryFormatterOutput: { ...defaultFormattedDSL },
            repoOutput: { ...defaultRepoOutput },
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
            queryFormatterOutput: {
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
            repoOutput: {
                total: 50,
                items: [ ...defaultRepoOutput.items.slice(18, 27) ],
                pagination: {
                    currentPage: 3,
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

    specificCases.forEach(({ description, input, queryFormatterOutput, repoOutput, expected }) => {
        it (description, async () => {        
            mockQueryFormatter.formatInput.mockReturnValue(queryFormatterOutput)
            mockRepository.search.mockResolvedValue(repoOutput);

            result = await sut.execute(input);
            
            expect (result).toEqual(expect.objectContaining(expected));
            expect (mockQueryFormatter.formatInput).toHaveBeenCalledExactlyOnceWith(input)
            expect (mockRepository.search).toHaveBeenCalledExactlyOnceWith(queryFormatterOutput);
        });
    });

    it ("should throw an InternalError when query formatter throws an unexpected error.", async () => {
        mockQueryFormatter.formatInput.mockImplementation(() => { throw new Error("Example") });

        await expect (sut.execute({})).rejects.toBeInstanceOf(InternalError);

        expect (mockQueryFormatter.formatInput).toHaveBeenCalledExactlyOnceWith({});
        expect (mockRepository.search).not.toHaveBeenCalled();
    });

    it ("should throw an InternalError when repository throws an unexpected error.", async () => {
        mockQueryFormatter.formatInput.mockReturnValue(defaultFormattedDSL);

        await expect (sut.execute({})).rejects.toBeInstanceOf(InternalError);

        expect (mockQueryFormatter.formatInput).toHaveBeenCalledExactlyOnceWith({});
        expect (mockRepository.search).toHaveBeenCalledExactlyOnceWith(defaultFormattedDSL);
    });
});