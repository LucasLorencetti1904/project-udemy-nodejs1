import AuthenticateUserUseCaseImpl from "@/users/application/usecases/authenticateUser/AuthenticateUserUseCaseImpl";
import MockUserRepository from "./UserRepository.mock";
import MockStringHashProvider from "test/common/application/usecases/StringHashProvider.mock";
import type UserModel from "@/users/domain/models/UserModel";
import type AuthenticateUserInput from "@/users/application/dto/AuthenticateUserInput";
import type { UserOutput } from "@/users/application/dto/userIo";
import { authenticateUserInputBuilder } from "@/users/infrastructure/testing/userInputBuilder";
import userModelBuilder from "@/users/infrastructure/testing/userModelBuilder";
import { BadRequestError, InternalError, NotFoundError } from "@/common/domain/errors/httpErrors";

let sut: AuthenticateUserUseCaseImpl;
let mockRepository: MockUserRepository;
let mockHashProvider: MockStringHashProvider;

let input: AuthenticateUserInput;
let userInstance: UserModel;

let result: UserOutput;

describe ("AuthenticateUserUseCaseImpl Test.", () => {
    beforeEach (() => {
        mockRepository = new MockUserRepository();
        mockHashProvider = new MockStringHashProvider();

        sut = new AuthenticateUserUseCaseImpl(mockRepository, mockHashProvider);
    });

    ["email", "password"].forEach((field) => {
        it (`should throw a BadRequestError when user ${field} is empty.`, async () => {
            input = authenticateUserInputBuilder({});
            input[field] = undefined;

            await expect (sut.execute(input)).rejects.toBeInstanceOf(BadRequestError);

            expect (mockRepository.findByEmail).not.toBeCalled();
            expect (mockHashProvider.compareWithHash).not.toBeCalled();
        });
    });
            
    it (`should throw a NotFoundError when user email is not found.`, async () => {
        input = authenticateUserInputBuilder({ email: "anyemail@gmail.com" });

        mockRepository.findByEmail.mockResolvedValue(null);

        await expect (sut.execute(input)).rejects.toBeInstanceOf(NotFoundError);

        expect (mockRepository.findByEmail).toHaveBeenCalledExactlyOnceWith(input.email);
        expect (mockHashProvider.compareWithHash).not.toHaveBeenCalled();
    });

    it (`should throw a BadRequestError when user password does not match.`, async () => {
        input = authenticateUserInputBuilder({ password: "AnyWrongPassword12345!*" });

        userInstance = userModelBuilder({});

        mockRepository.findByEmail.mockResolvedValue(userInstance);
        mockHashProvider.compareWithHash.mockResolvedValue(false);

        await expect (sut.execute(input)).rejects.toBeInstanceOf(BadRequestError);

        expect (mockRepository.findByEmail).toHaveBeenCalledExactlyOnceWith(input.email);
        expect (mockHashProvider.compareWithHash)
            .toHaveBeenCalledExactlyOnceWith(input.password, userInstance.password);
    });

    it (`should throw an InternalError when method 'findByEmail' of repository throws an unexpected error.`, async () => {
        input = authenticateUserInputBuilder({});

        mockRepository.findByEmail.mockRejectedValue(new Error());

        await expect (sut.execute(input)).rejects.toBeInstanceOf(InternalError);

        expect (mockRepository.findByEmail).toHaveBeenCalledExactlyOnceWith(input.email);
        expect (mockHashProvider.compareWithHash).not.toHaveBeenCalled();
    });

    it (`should throw an InternalError when method 'compareWithHash' of hash provider throws an unexpected error.`, async () => {
        input = authenticateUserInputBuilder({});

        userInstance = userModelBuilder({});

        mockRepository.findByEmail.mockResolvedValue(userInstance);
        mockHashProvider.compareWithHash.mockRejectedValue(new Error());

        await expect (sut.execute(input)).rejects.toBeInstanceOf(InternalError);

        expect (mockRepository.findByEmail).toHaveBeenCalledExactlyOnceWith(input.email);
        expect (mockHashProvider.compareWithHash)
            .toHaveBeenCalledExactlyOnceWith(input.password, userInstance.password);
    });

    it (`should a user instance when input email and password is valid.`, async () => {
        input = authenticateUserInputBuilder({});
        
        userInstance = userModelBuilder({});

        mockRepository.findByEmail.mockResolvedValue(userInstance);
        mockHashProvider.compareWithHash.mockResolvedValue(true);

        result = await sut.execute(input);

        const { password, ...output } = userInstance;

        expect (result).toEqual(output);
        expect (result).not.toHaveProperty("password");

        expect (mockRepository.findByEmail).toHaveBeenCalledExactlyOnceWith(input.email);
        expect (mockHashProvider.compareWithHash)
            .toHaveBeenCalledExactlyOnceWith(input.password, userInstance.password);
    });
});