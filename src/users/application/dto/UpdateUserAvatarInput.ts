import type UserAvatarImageFile from "@/users/application/dto/UserAvatarImageFile";

type UpdateUserAvatarInput = {
    id: string,
    avatarImage: UserAvatarImageFile
};

export default UpdateUserAvatarInput;