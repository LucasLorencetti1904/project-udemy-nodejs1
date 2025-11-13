import { inject, injectable } from "tsyringe";
import type UpdateUserAvatarUseCase from "@/users/application/usecases/updateUserAvatar/UpdateUserAvatarUseCase";
import UserUseCase from "@/users/application/usecases/default/UserUseCase";
import type UserRepository from "@/users/domain/repositories/UserRepository";
import type FileStorageProvider from "@/common/domain/providers/FileStorageProvider";
import type UserModel from "@/users/domain/models/UserModel";
import type UpdateUserAvatarInput from "@/users/application/dto/UpdateUserAvatarInput";
import type { UserOutput } from "@/users/application/dto/userIo";
import type UserAvatarImageFile from "@/users/application/dto/UserAvatarImageFile";
import { BadRequestError, NotFoundError } from "@/common/domain/errors/httpErrors";

@injectable()
export default class UpdateUserAvatarUseCaseImpl extends UserUseCase implements UpdateUserAvatarUseCase {
    private readonly avatarImageFileMaxSize: number = 1024 * 1024 * 3;
    private readonly validFileTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ];
    
    constructor(
        @inject("UserRepository")
        protected readonly repo: UserRepository,
        
        @inject("FileStorageProvider")
        private readonly storageProvider: FileStorageProvider
    ) { super(repo); }

    public async execute(input: UpdateUserAvatarInput): Promise<UserOutput> {
        try {
            this.verifyFileImage(input.avatarImage);

            const user: UserModel = await this.repo.findById(input.id);

            if (!user) {
                throw new NotFoundError(`User not found by ID: ${input.id}`);
            }

            const storedFileName: string = await this.storageProvider.storage(input.avatarImage);

            const updatedUser: UserModel = await this.repo.update({ ...user, avatar: storedFileName });

            return this.mapToUserOutput(updatedUser);
        }
        catch (e: unknown) {
            this.handleApplicationErrors(e);
        }
    }

    private verifyFileImage(file: UserAvatarImageFile): void {
        if (!this.validFileTypes.includes(file.type)) {
            throw new BadRequestError("File type is invalid.");
        }

        if (file.size > this.avatarImageFileMaxSize) {
            throw new BadRequestError("Too large file.");
        }
    }
}