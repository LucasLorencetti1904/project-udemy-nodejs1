import type UserModel from "@/users/domain/models/UserModel";

export type RequestUserPasswordResetInput = {
    email: string
};

export type RequestUserPasswordResetOutput = {
    user: UserModel,
    token: string
};