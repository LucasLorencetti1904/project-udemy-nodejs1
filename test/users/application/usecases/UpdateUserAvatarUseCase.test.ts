import UpdateUserAvatarUseCaseImpl from "@/users/application/usecases/authenticateUser/UpdateUserAvatarUseCaseImpl";
import { MockUserRepository, MockFileStorageProvider } from "../../providers.mock";
import type UserModel from "@/users/domain/models/UserModel";
import type UpdateUserAvatarInput from "@/users/application/dto/updateUserAvatarIo";
import TestingUserFactory from "test/users/testingHelpers/TestingUserFactory";
import TestingMiscGenerator from "test/users/testingHelpers/authGenerators/TestingMiscGenerator";
import { BadRequestError, InternalError, NotFoundError } from "@/common/domain/errors/httpErrors";
import { randomUUID } from "crypto";

let sut: UpdateUserAvatarUseCaseImpl;

let mockRepository: MockUserRepository;
let mockFileStorageProvider: MockFileStorageProvider;

let input: UpdateUserAvatarInput;

let userInstance: UserModel;
let avatarImagePath: string;
let updatedUserInstance: UserModel;

describe ("UpdateUserAvatarUseCaseImpl Test.", () => {
    beforeEach (() => {
        mockRepository = new MockUserRepository();
        mockFileStorageProvider = new MockFileStorageProvider();

        sut = new UpdateUserAvatarUseCaseImpl(mockRepository, mockFileStorageProvider);

        input = {
            id: randomUUID(),
            avatarImage: {
                name: "example.png",
                type: "image/png",
                size: 1024 * 1024,
                content: TestingMiscGenerator.buffer(1024 * 1024)
            }
        };
    });

    [
        { key: "name", value: "example.pdf", when: "extension is invalid" },
        { key: "type", value: "text/plain", when: " type is invalid" },
        { key: "size", value: (1024 * 1024 * 3) + 1, when: "size is too large (> 3 MB)." }
    ]
    .forEach(({ key, value, when}) => {
        it (`should throw a BadRequestError when avatar image file ${when}`, async () => {
            input.avatarImage[key] = value;
    
            await expect (sut.execute(input)).rejects.toBeInstanceOf(BadRequestError);
    
            expect (mockRepository.findById).not.toBeCalled();
            expect (mockFileStorageProvider.storage).not.toBeCalled();
            expect (mockRepository.update).not.toBeCalled();
        });
    });
            
    it (`should throw a NotFoundError when user id is not found.`, async () => {
        mockRepository.findById.mockResolvedValue(null);

        await expect (sut.execute(input)).rejects.toBeInstanceOf(NotFoundError);

        expect (mockRepository.findById).toHaveBeenCalledExactlyOnceWith(input.id);
        expect (mockFileStorageProvider.storage).not.toBeCalled();
        expect (mockRepository.update).not.toBeCalled();
    });

    it (`should throw a InternalError when method 'findById' of repository throws a unexpected error.`, async () => {
        mockRepository.findById.mockRejectedValue(new InternalError("Example"));

        await expect (sut.execute(input)).rejects.toBeInstanceOf(InternalError);

        expect (mockRepository.findById).toHaveBeenCalledExactlyOnceWith(input.id);
        expect (mockFileStorageProvider.storage).not.toBeCalled();
        expect (mockRepository.update).not.toBeCalled();
    });

    it (`should throw a InternalError when storage provider throws a unexpected error.`, async () => {
        mockRepository.findById.mockResolvedValue(TestingUserFactory.model({}));
        mockFileStorageProvider.storage.mockRejectedValue(new InternalError("Example"));

        await expect (sut.execute(input)).rejects.toBeInstanceOf(InternalError);

        expect (mockRepository.findById).toHaveBeenCalledExactlyOnceWith(input.id);
        expect (mockFileStorageProvider.storage).toHaveBeenCalledExactlyOnceWith(input.avatarImage);
        expect (mockRepository.update).not.toBeCalled();
    });

    it (`should throw a InternalError when method 'update' of repository throws a unexpected error.`, async () => {
        userInstance = TestingUserFactory.model({});
        avatarImagePath = `update/user/avatar/${input.avatarImage.name}`;

        mockRepository.findById.mockResolvedValue(userInstance);
        mockFileStorageProvider.storage.mockResolvedValue(avatarImagePath);
        mockRepository.update.mockRejectedValue(new Error("Example"));

        await expect (sut.execute(input)).rejects.toBeInstanceOf(InternalError);

        expect (mockRepository.findById).toHaveBeenCalledExactlyOnceWith(input.id);
        expect (mockFileStorageProvider.storage).toHaveBeenCalledExactlyOnceWith(input.avatarImage);
        expect (mockRepository.update).toHaveBeenCalledExactlyOnceWith({ ...userInstance, avatar: avatarImagePath });
    });

    it (`should return the updated user model with the new avatar.`, async () => {
        userInstance = TestingUserFactory.model({});
        avatarImagePath = `update/user/avatar/${input.avatarImage.name}`;
        updatedUserInstance = { ...userInstance, avatar: avatarImagePath };

        mockRepository.findById.mockResolvedValue(userInstance);
        mockFileStorageProvider.storage.mockResolvedValue(avatarImagePath);
        mockRepository.update.mockResolvedValue(updatedUserInstance);

        const { password, ...expected } = updatedUserInstance; 

        await expect (sut.execute(input)).resolves.toEqual(expected);

        expect (mockRepository.findById).toHaveBeenCalledExactlyOnceWith(input.id);
        expect (mockFileStorageProvider.storage).toHaveBeenCalledExactlyOnceWith(input.avatarImage);
        expect (mockRepository.update).toHaveBeenCalledExactlyOnceWith(updatedUserInstance);
    });
});