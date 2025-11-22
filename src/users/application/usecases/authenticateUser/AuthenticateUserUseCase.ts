import type { AuthenticateUserInput, AuthenticateUserOutput } from "@/users/application/dto/authenticateUserIo";

export default interface AuthenticateUserUseCase {
    execute(data: AuthenticateUserInput): Promise<AuthenticateUserOutput>;
}