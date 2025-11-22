import type { AuthenticateUserInput, AuthenticateUserOutput } from "@/users/application/dto/userDto/authenticateUserIo";

export default interface AuthenticateUserUseCase {
    execute(data: AuthenticateUserInput): Promise<AuthenticateUserOutput>;
}