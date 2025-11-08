import type { UserOutput } from "@/users/application/dto/userIo";
import type AuthenticateUserInput from "@/users/application/dto/AuthenticateUserInput";

export default interface AuthenticateUserUseCase {
    execute(data: AuthenticateUserInput): Promise<UserOutput>;
}