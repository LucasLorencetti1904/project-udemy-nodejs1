import UpdateUserAvatarUseCaseImpl from "@/users/application/usecases/updateUserAvatar/UpdateUserAvatarUseCaseImpl";
import { MockUserRepository, MockFileStorageProvider, MockUserTokenRepository, MockStringHashProvider } from "./UserUseCase.mock";
import type UserModel from "@/users/domain/models/UserModel";
import type UpdateUserAvatarInput from "@/users/application/dto/UpdateUserAvatarInput";
import TestingUserFactory from "test/testingTools/testingFactories/TestingUserFactory";
import TestingMiscGenerator from "test/testingTools/testingFactories/TestingMiscGenerator";
import { BadRequestError, InternalError, NotFoundError } from "@/common/domain/errors/httpErrors";
import { randomUUID } from "crypto";
import ResetUserPasswordUseCaseImpl from "@/users/application/usecases/resetUserPassword/ResetUserPasswordUseCaseImpl";
import ResetUserPasswordInput from "@/users/application/dto/ResetUserPasswordInput";
import UserTokenModel from "@/users/domain/models/UserTokenModel";
import TestingUserTokenFactory from "test/testingTools/testingFactories/TestingUserTokenFactory";

let sut: ResetUserPasswordUseCaseImpl;

let mockUserRepo: MockUserRepository;
let mockUserTokenRepo: MockUserTokenRepository;
let mockHashProvider: MockStringHashProvider;

let input: ResetUserPasswordInput;

let user: UserModel;
let tokenModel: UserTokenModel;

let hashPassword: string;

describe ("ResetUserPasswordUseCaseImpl Test.", () => {
    beforeEach (() => {
        mockUserTokenRepo = new MockUserTokenRepository();
        mockUserRepo = new MockUserRepository();
        mockHashProvider = new MockStringHashProvider();

        sut = new ResetUserPasswordUseCaseImpl(mockUserTokenRepo, mockUserRepo, mockHashProvider);
    });

    it (`should throw a NotFoundError when token does not exist.`, async () => {
        input = {
            token: randomUUID(),
            newPassword: TestingUserFactory.model({}).password
        };

        mockUserTokenRepo.findByToken.mockResolvedValue(null);

        await expect (sut.execute(input)).rejects.toBeInstanceOf(NotFoundError);

        expect (mockUserTokenRepo.findByToken).toHaveBeenCalledExactlyOnceWith(input.token);
        expect (mockUserRepo.findById).not.toBeCalled();
        expect (mockHashProvider.hashString).not.toHaveBeenCalled();
        expect (mockUserRepo.update).not.toBeCalled();
    });

    it (`should throw a BadRequestError when token is expired (2h).`, async () => {
        input = {
            token: randomUUID(),
            newPassword: TestingUserFactory.model({}).password
        };

        tokenModel = TestingUserTokenFactory.model({
            token: input.token,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
        });

        mockUserTokenRepo.findByToken.mockResolvedValue(tokenModel);
        mockUserRepo.findById.mockResolvedValue(null);

        await expect (sut.execute(input)).rejects.toBeInstanceOf(BadRequestError);

        expect (mockUserTokenRepo.findByToken).toHaveBeenCalledExactlyOnceWith(input.token);
        expect (mockUserRepo.findById).not.toHaveBeenCalled();
        expect (mockHashProvider.hashString).not.toHaveBeenCalled();
        expect (mockUserRepo.update).not.toBeCalled();
    });
            
    it (`should throw a NotFoundError when user is not found by id.`, async () => {
        input = {
            token: randomUUID(),
            newPassword: TestingUserFactory.model({}).password
        };

        tokenModel = TestingUserTokenFactory.model({ token: input.token });

        mockUserTokenRepo.findByToken.mockResolvedValue(tokenModel);
        mockUserRepo.findById.mockResolvedValue(null);

        await expect (sut.execute(input)).rejects.toBeInstanceOf(NotFoundError);

        expect (mockUserTokenRepo.findByToken).toHaveBeenCalledExactlyOnceWith(input.token);
        expect (mockUserRepo.findById).toHaveBeenCalledExactlyOnceWith(tokenModel.userId);
        expect (mockHashProvider.hashString).not.toHaveBeenCalled();
        expect (mockUserRepo.update).not.toBeCalled();
    });

    it (`should throw a InternalError when user token repository throws a unexpected error.`, async () => {
        input = {
            token: randomUUID(),
            newPassword: TestingUserFactory.model({}).password
        };

        mockUserTokenRepo.findByToken.mockRejectedValue(new Error("Example"));

        await expect (sut.execute(input)).rejects.toBeInstanceOf(InternalError);

        expect (mockUserTokenRepo.findByToken).toHaveBeenCalledExactlyOnceWith(input.token);
        expect (mockUserRepo.findById).not.toHaveBeenCalled();
        expect (mockHashProvider.hashString).not.toHaveBeenCalled();
        expect (mockUserRepo.update).not.toBeCalled();
    });

    it (`should throw a InternalError when user repository method 'findById' throws a unexpected error.`, async () => {
        input = {
            token: randomUUID(),
            newPassword: TestingUserFactory.model({}).password
        };

        tokenModel = TestingUserTokenFactory.model({ token: input.token });

        mockUserTokenRepo.findByToken.mockResolvedValue(tokenModel);
        mockUserRepo.findById.mockRejectedValue(new Error("Example"));

        await expect (sut.execute(input)).rejects.toBeInstanceOf(InternalError);

        expect (mockUserTokenRepo.findByToken).toHaveBeenCalledExactlyOnceWith(input.token);
        expect (mockUserRepo.findById).toHaveBeenCalledExactlyOnceWith(tokenModel.userId);
        expect (mockHashProvider.hashString).not.toHaveBeenCalled();
        expect (mockUserRepo.update).not.toBeCalled();
    });

    it (`should throw a InternalError when hash provider throws a unexpected error.`, async () => {
        input = {
            token: randomUUID(),
            newPassword: TestingUserFactory.model({}).password
        };

        tokenModel = TestingUserTokenFactory.model({ token: input.token });
        user = TestingUserFactory.model({ id: tokenModel.id });

        mockUserTokenRepo.findByToken.mockResolvedValue(tokenModel);
        mockUserRepo.findById.mockResolvedValue(user);
        mockHashProvider.hashString.mockRejectedValue(new Error(""));

        await expect (sut.execute(input)).rejects.toBeInstanceOf(InternalError);

        expect (mockUserTokenRepo.findByToken).toHaveBeenCalledExactlyOnceWith(input.token);
        expect (mockUserRepo.findById).toHaveBeenCalledExactlyOnceWith(tokenModel.userId);
        expect (mockHashProvider.hashString).toHaveBeenCalledExactlyOnceWith(input.newPassword);
        expect (mockUserRepo.update).not.toBeCalled();
    });

    it (`should throw a InternalError when user repository method 'update' throws a unexpected error.`, async () => {
        input = {
            token: randomUUID(),
            newPassword: TestingUserFactory.model({}).password
        };

        tokenModel = TestingUserTokenFactory.model({ token: input.token });
        user = TestingUserFactory.model({ id: tokenModel.id });

        hashPassword = "[Some hashed password]";

        mockUserTokenRepo.findByToken.mockResolvedValue(tokenModel);
        mockUserRepo.findById.mockResolvedValue(user);
        mockHashProvider.hashString.mockResolvedValue(hashPassword);
        mockUserRepo.update.mockRejectedValue(new Error("Example"));

        await expect (sut.execute(input)).rejects.toBeInstanceOf(InternalError);

        expect (mockUserTokenRepo.findByToken).toHaveBeenCalledExactlyOnceWith(input.token);
        expect (mockUserRepo.findById).toHaveBeenCalledExactlyOnceWith(tokenModel.userId);
        expect (mockHashProvider.hashString).toHaveBeenCalledExactlyOnceWith(input.newPassword);
        expect (mockUserRepo.update).toHaveBeenCalledExactlyOnceWith({ ...user, password: hashPassword });
    });

    it (`should change the user password with the new hashed password.`, async () => {
        input = {
            token: randomUUID(),
            newPassword: TestingUserFactory.model({}).password
        };

        tokenModel = TestingUserTokenFactory.model({ token: input.token });
        user = TestingUserFactory.model({ id: tokenModel.id });

        hashPassword = "[Some Hashed Password]";

        mockUserTokenRepo.findByToken.mockResolvedValue(tokenModel);
        mockUserRepo.findById.mockResolvedValue(user);
        mockHashProvider.hashString.mockResolvedValue(hashPassword);

        await sut.execute(input);

        expect (mockUserTokenRepo.findByToken).toHaveBeenCalledExactlyOnceWith(input.token);
        expect (mockUserRepo.findById).toHaveBeenCalledExactlyOnceWith(tokenModel.userId);
        expect (mockHashProvider.hashString).toHaveBeenCalledExactlyOnceWith(input.newPassword);
        expect (mockUserRepo.update).toHaveBeenCalledExactlyOnceWith({ ...user, password: hashPassword });
    });
});