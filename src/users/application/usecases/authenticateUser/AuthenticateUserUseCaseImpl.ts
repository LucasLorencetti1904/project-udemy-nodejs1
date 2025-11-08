import type AuthenticateUserUseCase from "@/users/application/usecases/authenticateUser/AuthenticateUserUseCase";
import UserUseCase from "@/users/application/usecases/default/UserUseCase";
import type AuthenticateUserInput from "../../dto/AuthenticateUserInput";
import type { UserOutput } from "@/users/application/dto/userIo";
import { inject, injectable } from "tsyringe";
import { BadRequestError, NotFoundError } from "@/common/domain/errors/httpErrors";
import type UserRepository from "@/users/domain/repositories/UserRepository";
import type StringHashProvider from "@/common/domain/providers/StringHashProvider";
import type UserModel from "@/users/domain/models/UserModel";

@injectable()
export default class AuthenticateUserUseCaseImpl extends UserUseCase implements AuthenticateUserUseCase {
    constructor(
        @inject("UserRepository")
        protected readonly repo: UserRepository,
        
        @inject("StringHashProvider")
        protected readonly hashProvider: StringHashProvider
    ) { super(repo) }

    public async execute(input: AuthenticateUserInput): Promise<UserOutput> {
        try {
            if (!input.email || !input.password) {
                throw new BadRequestError(`Invalid email or password`);
            }

            const user: UserModel = await this.repo.findByEmail(input.email);

            if (!user) {
                throw new NotFoundError(`Email does not exist: ${input.email}.`);
            }

            const passwordMaches: boolean = await this.passwordMatches(input, user);

            if (!passwordMaches) {
                throw new BadRequestError(`Incorrect password: ${input.password}`);
            }

            return this.mapToUserOutput(user);
        }
        catch (e: unknown) {
            this.handleApplicationErrors(e);
        }
    }

    private async passwordMatches(input: AuthenticateUserInput, instance: UserModel): Promise<boolean> {
        return await this.hashProvider.compareWithHash(input.password, instance.password);
    }
}