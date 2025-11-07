import AuthenticateUserInput from "@/users/application/dto/AuthenticateUserInput";
import { UserOutput } from "@/users/application/dto/userIo";

export default interface AuthenticateUserUseCase {
    execute(data: AuthenticateUserInput): Promise<UserOutput>;
}