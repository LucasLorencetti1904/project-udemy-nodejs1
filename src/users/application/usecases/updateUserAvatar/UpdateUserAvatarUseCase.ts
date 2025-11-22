import type UpdateUserAvatarInput from "@/users/application/dto/UpdateUserAvatarInput";
import type { UserOutput } from "@/users/application/dto/userIo";

export default interface UpdateUserAvatarUseCase {
    execute(input: UpdateUserAvatarInput): Promise<UserOutput>
}