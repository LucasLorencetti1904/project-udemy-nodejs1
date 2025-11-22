import { faker } from "@faker-js/faker";
import { randomUUID } from "node:crypto";
import type { AuthenticateUserInput } from "@/users/application/dto/userDto/authenticateUserIo";
import type UpdateUserInput from "@/users/application/dto/userDto/UpdateUserInput";
import type UpdateUserAvatarInput from "@/users/application/dto/userDto/UpdateUserAvatarInput";
import type UserAvatarImageFile from "@/users/application/dto/userDto/UserAvatarImageFile";
import type CreateUserInput from "@/users/application/dto/userDto/CreateUserInput";
import type { UserInput, UserOutput } from "@/users/application/dto/userDto/userIo";
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

    public static avatarImage(props: Partial<Omit<UserAvatarImageFile, "content">>): UserAvatarImageFile {
        const buffer = faker.string.binary({ length: props.size ?? faker.number.int({ min: 0, max: 1024 * 1024 * 3 }) });
        const fileBuffer = Buffer.from(buffer, "binary");

        return {
            name: props.name ?? faker.system.fileName(),
            type: props.type ?? faker.system.mimeType(),
            size: fileBuffer.length,
            content: fileBuffer,
        };
    }


    public static updateInput(props: Partial<UpdateUserInput>): UpdateUserInput {
        return {
            id: randomUUID(),
            name: props.name ?? faker.person.fullName(),
            email: props.email ?? faker.internet.email(),
            password: props.password ?? faker.internet.password(),
            avatar: props.avatar
        };
    }

    public static updateAvatarInput(props: Partial<UpdateUserAvatarInput>): UpdateUserAvatarInput {
        return {
            id: props.id ?? randomUUID(),
            avatarImage: this.avatarImage(props.avatarImage)
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
            id: props.id ?? randomUUID(),
            name: props.name ?? faker.person.fullName(),
            email: props.email ?? faker.internet.email(),
            createdAt: props.createdAt ?? new Date(),
            updatedAt: props.updatedAt ?? new Date()
        };
    }
}