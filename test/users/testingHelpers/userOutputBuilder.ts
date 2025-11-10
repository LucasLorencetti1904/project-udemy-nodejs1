import type { UserOutput } from "@/users/application/dto/userIo";
import { faker } from "@faker-js/faker";
import { randomUUID } from "node:crypto";

export default function userOutputBuilder(props: Partial<UserOutput>): UserOutput {
    return {
        id: randomUUID(),
        name: props.name ?? faker.person.fullName(),
        email: props.email ?? faker.internet.email(),
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date()
    };
}