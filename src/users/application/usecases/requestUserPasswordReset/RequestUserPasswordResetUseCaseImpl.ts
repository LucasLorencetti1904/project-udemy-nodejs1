import { inject, injectable } from "tsyringe";
import type RequestUserPasswordResetUseCase from "@/users/application/usecases/requestUserPasswordReset/RequestUserPasswordResetUseCase";
import type { RequestUserPasswordResetInput, RequestUserPasswordResetOutput } from "@/users/application/dto/RequestUserPasswordReset";
import type UserModel from "@/users/domain/models/UserModel";
import type UserRepository from "@/users/domain/repositories/userRepository/UserRepository";
import type UserTokenRepository from "@/users/domain/repositories/userTokenRepository/UserTokenRepository";
import { NotFoundError } from "@/common/domain/errors/httpErrors";
import ApplicationHandler from "@/common/application/helpers/ApplicationHandler";

@injectable()
export default class RequestUserPasswordResetUseCaseImpl implements RequestUserPasswordResetUseCase {
    constructor(
        @inject("UserRepository")
        private readonly userRepo: UserRepository,

        @inject("UserTokenRepo")
        private readonly userTokenRepo: UserTokenRepository
    ) {}

    public async execute(input: RequestUserPasswordResetInput): Promise<RequestUserPasswordResetOutput> {
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