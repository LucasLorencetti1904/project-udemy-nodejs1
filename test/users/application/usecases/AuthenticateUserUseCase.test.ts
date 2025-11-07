import type AuthenticateUserInput from "@/users/application/dto/AuthenticateUserInput";
import type { UserOutput } from "@/users/application/dto/userIo";
import MockStringHashProvider from "test/common/application/usecases/StringHashProvider.mock";
import MockUserRepository from "./UserRepository.mock";
import { BadRequestError, NotFoundError } from "@/common/domain/errors/httpErrors";
import { authenticateUserInputBuilder } from "@/users/infrastructure/testing/userInputBuilder";
import userModelBuilder from "@/users/infrastructure/testing/userModelBuilder";
import type UserModel from "@/users/domain/models/UserModel";

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

        mockRepository.findByEmail.mockResolvedValue(userModelBuilder({}));
        mockHashProvider.compareWithHash.mockResolvedValue(false);

        await expect (sut.execute(input)).rejects.toBeInstanceOf(BadRequestError);

        expect (mockRepository.findByEmail).toHaveBeenCalledExactlyOnceWith(input.email);
        expect (mockHashProvider.compareWithHash).toHaveBeenCalledExactlyOnceWith(input.password);
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
        expect (mockHashProvider.compareWithHash).toHaveBeenCalledExactlyOnceWith(input.password);
    });
});