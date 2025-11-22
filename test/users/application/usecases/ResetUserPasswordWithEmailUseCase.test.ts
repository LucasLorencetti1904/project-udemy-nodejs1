import ResetUserPasswordWithEmailUseCaseImpl from "@/users/application/usecases/resetUserPasswordWithEmail/ResetUserPasswordWithEmailUseCaseImpl";
import { MockUserRepository, MockUserTokenRepository } from "./UserUseCase.mock";
import { ResetUserPasswordWithEmailInput, ResetUserPasswordWithEmailOutput } from "@/users/application/dto/ResetUserPasswordWithEmailIo";
import { InternalError, NotFoundError } from "@/common/domain/errors/httpErrors";
import UserModel from "@/users/domain/models/UserModel";
import TestingUserFactory from "test/testingTools/testingFactories/TestingUserFactory";
import UserTokenModel from "@/users/domain/models/UserTokenModel";
import TestingUserTokenFactory from "test/testingTools/testingFactories/TestingUserTokenFactory";

let sut: ResetUserPasswordWithEmailUseCaseImpl; 

let mockUserRepo: MockUserRepository;
let mockUserTokenRepo: MockUserTokenRepository;

let user: UserModel;
let tokenModel: UserTokenModel;

let input: ResetUserPasswordWithEmailInput;
let result: ResetUserPasswordWithEmailOutput;

describe ("ResetUserPasswordWithEmailUseCase Test", () => {
    beforeEach (() => {
        mockUserRepo = new MockUserRepository();
        mockUserTokenRepo = new MockUserTokenRepository();

        sut = new ResetUserPasswordWithEmailUseCaseImpl(mockUserRepo, mockUserTokenRepo);
    });

    it ("it should throw an NotFoundError when user is not found by email.", async () => {
        mockUserRepo.findByEmail.mockResolvedValue(null);

        input = { email: "example@gmail.com" };
        await expect (sut.execute(input)).rejects.toBeInstanceOf(NotFoundError);

        expect (mockUserRepo.findByEmail).toHaveBeenCalledExactlyOnceWith(input.email);
        expect (mockUserTokenRepo.generateToken).not.toHaveBeenCalled();
    });

    it ("it should throw an InternalError when user repository throws an unexpected error.", async () => {
        mockUserRepo.findByEmail.mockRejectedValue(new Error("Example"));

        input = { email: "example@gmail.com" };
        await expect (sut.execute(input)).rejects.toBeInstanceOf(InternalError);

        expect (mockUserRepo.findByEmail).toHaveBeenCalledExactlyOnceWith(input.email);
        expect (mockUserTokenRepo.generateToken).not.toHaveBeenCalled();
    });

    it ("it should throw an InternalError when user token repository throws an unexpected error.", async () => {
        user = TestingUserFactory.model({ email: "example@gmail.com" });
        
        mockUserRepo.findByEmail.mockResolvedValue(user);
        mockUserTokenRepo.generateToken.mockRejectedValue(new Error("Example"));

        input = { email: user.email };
        await expect (sut.execute(input)).rejects.toBeInstanceOf(InternalError);

        expect (mockUserRepo.findByEmail).toHaveBeenCalledExactlyOnceWith(input.email);
        expect (mockUserTokenRepo.generateToken).toHaveBeenCalledExactlyOnceWith(user.id);
    });

    it ("it should return the generated token and user data.", async () => {
        user = TestingUserFactory.model({ email: "example@gmail.com" });
        tokenModel = TestingUserTokenFactory.model({ userId: user.id });

        mockUserRepo.findByEmail.mockResolvedValue(user);
        mockUserTokenRepo.generateToken.mockResolvedValue(tokenModel);

        input = { email: user.email };

        result = await sut.execute(input);
        expect (result).toEqual({ token: tokenModel.token, user });

        expect (mockUserRepo.findByEmail).toHaveBeenCalledExactlyOnceWith(input.email);
        expect (mockUserTokenRepo.generateToken).toHaveBeenCalledExactlyOnceWith(user.id);
    });
});