import type CreateUserInput from "@/users/application/dto/userDto/CreateUserInput";
import type { UserOutput } from "@/users/application/dto/userDto/userIo";

export default interface CreateUserUseCase {
    execute(data: CreateUserInput): Promise<UserOutput>;
}