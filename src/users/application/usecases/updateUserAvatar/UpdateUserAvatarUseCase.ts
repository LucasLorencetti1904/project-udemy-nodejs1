import type UpdateUserAvatarInput from "@/users/application/dto/userDto/UpdateUserAvatarInput";
import type { UserOutput } from "@/users/application/dto/userDto/userIo";

export default interface UpdateUserAvatarUseCase {
    execute(input: UpdateUserAvatarInput): Promise<UserOutput>
}