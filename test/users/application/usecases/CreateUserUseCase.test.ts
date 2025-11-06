import type CreateUserInput from "@/users/application/dto/CreateUserInput";
import type { UserOutput } from "@/users/application/dto/userIo";
import MockStringHashProvider from "test/common/application/usecases/StringHashProvider.mock";
import MockUserRepository from "./UserRepository.mock";
import { BadRequestError, ConflictError, InternalError } from "@/common/domain/errors/httpErrors";
import { createUserInputBuilder } from "@/users/infrastructure/testing/userInputBuilder";
import userOutputBuilder from "@/users/infrastructure/testing/userOutputBuilder";

let sut: CreateUserUseCaseImpl;
let mockRepository: MockUserRepository;
let mockHashProvider: MockStringHashProvider;

let userInputData: CreateUserInput;
let userOutputData: UserOutput;

const exampleOfHashPassword: string = "$2b$06$Kb7JH8s9Qv1m2n3o4p5q6uvW8yZ0a1B2c3D4e5F6g7H8i9J0K1L2m";

describe ("CreateUserUseCaseImpl Test.", () => {
    beforeEach (() => {
        mockHashProvider = new MockStringHashProvider();
        mockRepository = new MockUserRepository();

        sut = new CreateUserUseCaseImpl(mockHashProvider, mockRepository);
    });

    ["name", "email", "password"].forEach((field) => {
        it (`should throw BadRequestError when user ${field} is empty.`, async () => {
            userInputData = createUserInputBuilder({ [field]: "" })

            await expect (sut.execute(userInputData)).rejects.toBeInstanceOf(BadRequestError);
            
            ["findByEmail", "create", "insert"].forEach((repoMethod) => {
                expect (mockHashProvider.hashString).not.toHaveBeenCalled();
                expect (mockRepository[repoMethod]).not.toHaveBeenCalled();
            })
        });
    });

    it ("should throw ConflictError when user email already exists.", async () => {
        userInputData = createUserInputBuilder({ email: "existentemail@gmail.com" });

        mockRepository.findByEmail.mockResolvedValue(userInputData.email);

        await expect ((sut.execute(userInputData))).rejects.toBeInstanceOf(ConflictError);
        
        expect (mockRepository.findByEmail).toHaveBeenCalledExactlyOnceWith(userInputData.email);

        [mockHashProvider.hashString, mockRepository.create, mockRepository.insert].forEach((method) => {
            expect (method).not.toHaveBeenCalled();
        })
    });

    [
        { repoMethod: "findByEmail", mockResult: vi.fn().mockRejectedValue(new Error()) },
        { repoMethod: "create", mockResult: vi.fn(() => { throw new Error() }) },
        { repoMethod: "insert", mockResult: vi.fn().mockRejectedValue(new Error()) }
    ]
    .forEach(({ repoMethod, mockResult }) => {
        it (`should throw an InternalError when method '${repoMethod}' of repository throws an unexpected error.`, async () => {
            mockRepository[repoMethod as any] = mockResult;
            await expect (sut.execute(userInputData)).rejects.toBeInstanceOf(InternalError);
        });
    });

    it (`should throw an InternalError when method 'hashString' of hash provider throws an unexpected error.`, async () => {
        mockHashProvider.hashString.mockRejectedValue(new Error());
        await expect (sut.execute(userInputData)).rejects.toBeInstanceOf(InternalError);
    });

    [
        { name: "User" }, { name: "New User" },
        { email: "emailexample@gmail.com" }, { email: "otheremailexample@outlook.com" },
        { password: "PasswordExample12345!*" }, { password: "1A2B3C4D5E" }
    ]
    .forEach((specificInput) => {
        it ("should return a new user with hash password when input data is valid.", async () => {
            userInputData = createUserInputBuilder({ ...specificInput });
            userOutputData = userOutputBuilder({ ...userInputData, password: exampleOfHashPassword });

            mockRepository.findByEmail.mockResolvedValue(null);
            mockHashProvider.hashString.mockResolvedValue(exampleOfHashPassword);
            mockRepository.create.mockReturnValue(userOutputData);

            const userInputDataWithHashPassword: CreateUserInput = { ...userInputData, password: exampleOfHashPassword };

            await expect ((sut.execute(userInputData))).resolves.toEqual(userOutputData);
    
            expect(mockHashProvider.hashString).toHaveBeenCalledExactlyOnceWith(userInputData.password);

            [
                { repoMethod: "findByEmail", expectedValue: userInputData.email },
                { repoMethod: "create", expectedValue: userInputDataWithHashPassword },
                { repoMethod: "insert", expectedValue: userOutputData }
            ]
            .forEach(({repoMethod, expectedValue}) => {
                expect (mockRepository[repoMethod as keyof MockUserRepository])
                    .toHaveBeenCalledExactlyOnceWith(expectedValue);
            });
        });
    });
});
