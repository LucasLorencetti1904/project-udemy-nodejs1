import type UpdateUserAvatarInput from "@/users/application/dto/updateUserAvatarIo";
import type { UserOutput } from "@/users/application/dto/userIo";

export default interface UpdateUserAvatarUseCase {
    execute(input: UpdateUserAvatarInput): Promise<UserOutput>
}