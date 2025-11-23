import { inject, injectable } from "tsyringe";
import type ResetUserPasswordUseCase from "@/users/application/usecases/resetUserPassword/ResetUserPasswordUseCase";
import type ResetUserPasswordInput from "@/users/application/dto/ResetUserPasswordInput";
import type UserTokenRepository from "@/users/domain/repositories/userTokenRepository/UserTokenRepository";
import type UserRepository from "@/users/domain/repositories/userRepository/UserRepository";
import type StringHashProvider from "@/common/domain/providers/StringHashProvider";
import type UserModel from "@/users/domain/models/UserModel";
import type UserTokenModel from "@/users/domain/models/UserTokenModel";
import ApplicationHandler from "@/common/application/helpers/ApplicationHandler";
import { BadRequestError, NotFoundError } from "@/common/domain/errors/httpErrors";

@injectable()
export default class ResetUserPasswordUseCaseImpl implements ResetUserPasswordUseCase {
    constructor(
        @inject("UserTokenRepository")
        private readonly userTokenRepo: UserTokenRepository,

        @inject("UserRepository")
        private readonly userRepo: UserRepository,
        
        @inject("StringHashProvider")
        private readonly hashProvider: StringHashProvider
    ) {}

    public async execute(input: ResetUserPasswordInput): Promise<void> {
        try {
            const token: UserTokenModel = await this.userTokenRepo.findByToken(input.token);

            if (!token) {
                throw new NotFoundError("Password Reset Token not found.");
            }

            if (this.hasPassedTwoHours(token.createdAt)) {
                throw new BadRequestError("Password Reset Token is expired.");
            }

            const user: UserModel = await this.userRepo.findById(token.userId);

            if (!user) {
                throw new NotFoundError(`User not found by ID: ${token.userId}`);
            }

            const hashPassword: string = await this.hashProvider.hashString(input.newPassword);

            const userWithNewPassword: UserModel = { ...user, password: hashPassword };

            await this.userRepo.update(userWithNewPassword);
        }

        catch (e: unknown) {
            ApplicationHandler.handleErrors(e);
        }
    }

    private hasPassedTwoHours(tokenCreationDate: Date): boolean {
        const diffInMs: number = Date.now() - tokenCreationDate.getTime();
        const twoHoursInMs: number = 2 * 60 * 60 * 1000;

        return diffInMs > twoHoursInMs;
    }
}