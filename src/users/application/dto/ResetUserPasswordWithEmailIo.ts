import type UserModel from "@/users/domain/models/UserModel";

export type ResetUserPasswordWithEmailInput = {
    email: string
};

export type ResetUserPasswordWithEmailOutput = {
    user: UserModel,
    token: string
};