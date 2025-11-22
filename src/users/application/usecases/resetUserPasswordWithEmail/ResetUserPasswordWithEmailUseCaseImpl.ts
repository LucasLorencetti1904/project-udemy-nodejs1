import { inject, injectable } from "tsyringe";
import type { ResetUserPasswordWithEmailInput, ResetUserPasswordWithEmailOutput } from "@/users/application/dto/ResetUserPasswordWithEmailIo";
import type UserModel from "@/users/domain/models/UserModel";
import type UserRepository from "@/users/domain/repositories/userRepository/UserRepository";
import type UserTokenRepository from "@/users/domain/repositories/userTokenRepository/UserTokenRepository";
import { NotFoundError } from "@/common/domain/errors/httpErrors";
import ApplicationHandler from "@/common/application/helpers/ApplicationHandler";

@injectable()
export default class ResetUserPasswordWithEmailUseCaseImpl {
    constructor(
        @inject("UserRepository")
        private readonly userRepo: UserRepository,

        @inject("UserTokenRepo")
        private readonly userTokenRepo: UserTokenRepository
    ) {}

    public async execute(input: ResetUserPasswordWithEmailInput): Promise<ResetUserPasswordWithEmailOutput> {
        try {
            const user: UserModel = await this.userRepo.findByEmail(input.email);

            if (!user) {
                throw new NotFoundError(`User not found with email: ${input.email}`);
            }

            const token: string = (await this.userTokenRepo.generateToken(user.id)).token;
            
            return { user, token };
        }

        catch (e: unknown) {
            ApplicationHandler.handleErrors(e);
        }
    }
}