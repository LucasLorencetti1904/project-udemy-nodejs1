import type CreateUserTokenInput from "@/users/application/dto/userTokenDto/CreateUserTokenInput";
import UpdateUserTokenInput from "@/users/application/dto/userTokenDto/UpdateUserTokenInput";
import type UserTokenModel from "@/users/domain/models/UserTokenModel";
import { randomUUID } from "node:crypto";

export default class TestingUserTokenFactory {
    public static model(props: Partial<UserTokenModel>): UserTokenModel {
        return {
            id: props.id ?? randomUUID(),
            token: props.token ?? randomUUID(),
            userId: props.userId ?? randomUUID(),
            createdAt: props.createdAt ?? new Date(),
            updatedAt: props.updatedAt ?? new Date()
        };
    }

    public static createInput(props: Partial<CreateUserTokenInput>): CreateUserTokenInput {
        return {
            userId: props.userId ?? randomUUID()
        };
    }

    public static updateInput(props: Partial<UpdateUserTokenInput>): UpdateUserTokenInput {
        return {
            id: props.id ?? randomUUID(),
            token: props.token ?? randomUUID(),
            userId: props.userId ?? randomUUID()
        }
    }
}