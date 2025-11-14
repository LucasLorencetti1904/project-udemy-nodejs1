import { inject, injectable } from "tsyringe";
import UserUseCase from "@/users/application/usecases/default/UserUseCase";
import type AuthenticateUserUseCase from "@/users/application/usecases/authenticateUser/AuthenticateUserUseCase";
import type UserRepository from "@/users/domain/repositories/userRepository/UserRepository";
import type StringHashProvider from "@/common/domain/providers/StringHashProvider";
import type AuthenticationProvider from "@/common/domain/providers/AuthenticationProvider";
import type UserModel from "@/users/domain/models/UserModel";
import type { AuthenticateUserInput, AuthenticateUserOutput } from "@/users/application/dto/authenticateUserIo";
import { UnauthorizedError } from "@/common/domain/errors/httpErrors";

@injectable()
export default class AuthenticateUserUseCaseImpl extends UserUseCase implements AuthenticateUserUseCase {
    constructor(
        @inject("UserRepository")
        protected readonly repo: UserRepository,
        
        @inject("StringHashProvider")
        private readonly hashProvider: StringHashProvider,

        @inject("AuthenticationProvider")
        private readonly authProvider: AuthenticationProvider
    ) { super(repo); }

    public async execute(input: AuthenticateUserInput): Promise<AuthenticateUserOutput> {
        try {
            if (!input.email || !input.password) {
                throw new UnauthorizedError(`Invalid email or password`);
            }

            const user: UserModel = await this.repo.findByEmail(input.email);

            if (!user) {
                throw new UnauthorizedError(`Email does not exist: ${input.email}.`);
            }

            const passwordMaches: boolean = await this.passwordMatches(input, user);

            if (!passwordMaches) {
                throw new UnauthorizedError(`Incorrect password: ${input.password}`);
            }

            return this.authProvider.generateToken(user.id);
        }
        catch (e: unknown) {
            this.handleApplicationErrors(e);
        }
    }

    private async passwordMatches(input: AuthenticateUserInput, instance: UserModel): Promise<boolean> {
        return await this.hashProvider.compareWithHash(input.password, instance.password);
    }
}