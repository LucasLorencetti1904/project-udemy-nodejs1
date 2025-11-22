import type UserAvatarImageFile from "@/users/application/dto/userDto/UserAvatarImageFile";

type UpdateUserAvatarInput = {
    id: string,
    avatarImage: UserAvatarImageFile
};

export default UpdateUserAvatarInput;