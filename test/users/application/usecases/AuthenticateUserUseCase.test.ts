import AuthenticateUserUseCaseImpl from "@/users/application/usecases/authenticateUser/AuthenticateUserUseCaseImpl";
import { MockUserRepository, MockStringHashProvider, MockAuthenticationProvider } from "../../providers.mock";
import type UserModel from "@/users/domain/models/UserModel";
import type { AuthenticateUserInput, AuthenticateUserOutput } from "@/users/application/dto/authenticateUserIo";
import TestingUserFactory from "test/users/testingHelpers/TestingUserFactory";
import { InternalError, UnauthorizedError } from "@/common/domain/errors/httpErrors";

let sut: AuthenticateUserUseCaseImpl;

let mockRepository: MockUserRepository;
let mockHashProvider: MockStringHashProvider;
let mockAuthProvider: MockAuthenticationProvider;

let input: AuthenticateUserInput;
let userInstance: UserModel;

let result: AuthenticateUserOutput;

describe ("AuthenticateUserUseCaseImpl Test.", () => {
    beforeEach (() => {
        mockRepository = new MockUserRepository();
        mockHashProvider = new MockStringHashProvider();
        mockAuthProvider = new MockAuthenticationProvider()

        sut = new AuthenticateUserUseCaseImpl(mockRepository, mockHashProvider, mockAuthProvider);
    });

    ["email", "password"].forEach((field) => {
        it (`should throw a UnauthorizedError when user ${field} is empty.`, async () => {
            input = TestingUserFactory.authenticateInput({});
            input[field] = undefined;

            await expect (sut.execute(input)).rejects.toBeInstanceOf(UnauthorizedError);

            expect (mockRepository.findByEmail).not.toBeCalled();
            expect (mockHashProvider.compareWithHash).not.toBeCalled();
            expect (mockAuthProvider.generateToken).not.toBeCalled();
        });
    });
            
    it (`should throw a UnauthorizedError when user email is not found.`, async () => {
        input = TestingUserFactory.authenticateInput({ email: "anyemail@gmail.com" });

        mockRepository.findByEmail.mockResolvedValue(null);

        await expect (sut.execute(input)).rejects.toBeInstanceOf(UnauthorizedError);

        expect (mockRepository.findByEmail).toHaveBeenCalledExactlyOnceWith(input.email);
        expect (mockHashProvider.compareWithHash).not.toHaveBeenCalled();
        expect (mockAuthProvider.generateToken).not.toBeCalled();
    });

    it (`should throw a UnauthorizedError when user password does not match.`, async () => {
        input = TestingUserFactory.authenticateInput({ password: "AnyWrongPassword12345!*" });

        userInstance = TestingUserFactory.model({});

        mockRepository.findByEmail.mockResolvedValue(userInstance);
        mockHashProvider.compareWithHash.mockResolvedValue(false);

        await expect (sut.execute(input)).rejects.toBeInstanceOf(UnauthorizedError);

        expect (mockRepository.findByEmail).toHaveBeenCalledExactlyOnceWith(input.email);
        expect (mockHashProvider.compareWithHash)
            .toHaveBeenCalledExactlyOnceWith(input.password, userInstance.password);
        expect (mockAuthProvider.generateToken).not.toBeCalled();
    });

    it (`should throw an InternalError when method 'findByEmail' of repository throws an unexpected error.`, async () => {
        input = TestingUserFactory.authenticateInput({});

        mockRepository.findByEmail.mockRejectedValue(new Error());

        await expect (sut.execute(input)).rejects.toBeInstanceOf(InternalError);

        expect (mockRepository.findByEmail).toHaveBeenCalledExactlyOnceWith(input.email);
        expect (mockHashProvider.compareWithHash).not.toHaveBeenCalled();
        expect (mockAuthProvider.generateToken).not.toBeCalled();
    });

    it (`should throw an InternalError when method 'compareWithHash' of hash provider throws an unexpected error.`, async () => {
        input = TestingUserFactory.authenticateInput({});

        userInstance = TestingUserFactory.model({});

        mockRepository.findByEmail.mockResolvedValue(userInstance);
        mockHashProvider.compareWithHash.mockRejectedValue(new Error());

        await expect (sut.execute(input)).rejects.toBeInstanceOf(InternalError);

        expect (mockRepository.findByEmail).toHaveBeenCalledExactlyOnceWith(input.email);
        expect (mockHashProvider.compareWithHash)
            .toHaveBeenCalledExactlyOnceWith(input.password, userInstance.password);
        expect (mockAuthProvider.generateToken).not.toBeCalled();
    });

    it (`should throw an InternalError when method 'generateToken' of authentication provider throws an unexpected error.`, async () => {
        input = TestingUserFactory.authenticateInput({});

        userInstance = TestingUserFactory.model({});

        mockRepository.findByEmail.mockResolvedValue(userInstance);
        mockHashProvider.compareWithHash.mockResolvedValue(true);
        mockAuthProvider.generateToken.mockImplementation(() => { throw new Error(); });

        await expect (sut.execute(input)).rejects.toBeInstanceOf(InternalError);

        expect (mockRepository.findByEmail).toHaveBeenCalledExactlyOnceWith(input.email);
        expect (mockHashProvider.compareWithHash)
            .toHaveBeenCalledExactlyOnceWith(input.password, userInstance.password);
        expect (mockAuthProvider.generateToken).toHaveBeenCalledExactlyOnceWith(userInstance.id);
    });

    it (`should a user instance when input email and password is valid.`, async () => {
        input = TestingUserFactory.authenticateInput({});
        
        userInstance = TestingUserFactory.model({});

        mockRepository.findByEmail.mockResolvedValue(userInstance);
        mockHashProvider.compareWithHash.mockResolvedValue(true);
        mockAuthProvider.generateToken
            .mockReturnValue({ token: "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.dBj5W9i5jzA" });

        result = await sut.execute(input);

        expect (result).toEqual({
            token: "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.dBj5W9i5jzA"
        });

        expect (mockRepository.findByEmail).toHaveBeenCalledExactlyOnceWith(input.email);
        expect (mockHashProvider.compareWithHash)
            .toHaveBeenCalledExactlyOnceWith(input.password, userInstance.password);
        expect (mockAuthProvider.generateToken).toHaveBeenCalledExactlyOnceWith(userInstance.id)
    });
});