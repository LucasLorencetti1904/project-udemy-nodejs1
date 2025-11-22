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

    }
}