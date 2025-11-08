import type UserModel from "@/users/domain/models/UserModel";
import { randomUUID } from "node:crypto";
import { faker } from "@faker-js/faker";

export default function userModelBuilder(props: Partial<UserModel>): UserModel {
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