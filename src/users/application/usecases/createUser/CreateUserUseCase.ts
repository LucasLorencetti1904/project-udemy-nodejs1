import CreateUserInput from "@/users/application/dto/CreateUserInput";
import { UserOutput } from "@/users/application/dto/userIo";

export default interface CreateUserUseCase {
    execute(data: CreateUserInput): Promise<UserOutput>;
}