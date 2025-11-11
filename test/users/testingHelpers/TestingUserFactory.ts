import { faker } from "@faker-js/faker";
import { randomUUID } from "node:crypto";
import type { AuthenticateUserInput } from "@/users/application/dto/authenticateUserIo";
import type CreateUserInput from "@/users/application/dto/CreateUserInput";
import type { UserInput, UserOutput } from "@/users/application/dto/userIo";
import type UserModel from "@/users/domain/models/UserModel";

export default class TestingUserFactory {
    public static input(props: Partial<UserInput>): UserInput {
        return {
            name: props.name ?? faker.person.fullName(),
            email: props.email ?? faker.internet.email(),
            password: props.password ?? faker.internet.password()
        };
    }

    public static authenticateInput(props: Partial<AuthenticateUserInput>): AuthenticateUserInput {
        return {
            email: props.email ?? faker.internet.email(),
            password: props.password ?? faker.internet.password()     
        };
    }

    public static createInput(props: Partial<CreateUserInput>): CreateUserInput {
        return {
            name: props.name ?? faker.person.fullName(),
            email: props.email ?? faker.internet.email(),
            password: props.password ?? faker.internet.password()
        };
    }

    public static model(props: Partial<UserModel>): UserModel {
        return {
            id: props.id ?? randomUUID(),
            name: props.name ?? faker.person.fullName(),
            email: props.email ?? faker.internet.email(),
            password: props.password ?? faker.internet.password(),
            avatar: props.avatar,
            createdAt: props.createdAt ?? new Date(),
            updatedAt: props.updatedAt ?? new Date()
        };
    }

    public static output(props: Partial<UserOutput>): UserOutput {
        return {
            id: randomUUID(),
            name: props.name ?? faker.person.fullName(),
            email: props.email ?? faker.internet.email(),
            createdAt: props.createdAt ?? new Date(),
            updatedAt: props.updatedAt ?? new Date()
        };
    }
}