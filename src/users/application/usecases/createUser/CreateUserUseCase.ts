import type CreateUserInput from "@/users/application/dto/CreateUserInput";
import type { UserOutput } from "@/users/application/dto/userIo";

export default interface CreateUserUseCase {
    execute(data: CreateUserInput): Promise<UserOutput>;
}