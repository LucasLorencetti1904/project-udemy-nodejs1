import type UserTokenModel from "@/users/domain/models/UserTokenModel";
import type CreateUserTokenProps from "@/users/domain/repositories/userTokenRepository/CreateUserTokenProps";
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

    public static createInput(props: Partial<CreateUserTokenProps>): CreateUserTokenProps {
        return {
            userId: props.userId ?? randomUUID()
        };
    }
}