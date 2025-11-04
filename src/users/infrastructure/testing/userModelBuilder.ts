import UserModel from "@/users/domain/models/UserModel";
import { updateUserInputBuilder } from "./userInputBuilder";

export default function userModelBuilder(props: Partial<UserModel>): UserModel {
    return {
        ...updateUserInputBuilder(props),
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date()
    };
}