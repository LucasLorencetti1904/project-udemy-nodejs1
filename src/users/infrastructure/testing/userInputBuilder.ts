import { faker } from "@faker-js/faker";
import { randomUUID } from "node:crypto";
import CreateUserInput from "@/users/application/dto/CreateUserInput";
import UpdateUserInput from "@/users/application/dto/UpdateUserInput";
import { UserInput } from "@/users/application/dto/userIo";

export default function userInputBuilder(props: Partial<UserInput>): Required<UserInput> {
    return {
        name: props.name ?? faker.person.fullName(),
        email: props.email ?? faker.internet.email(),
        password: props.password ?? faker.internet.password(),
    };
}

export function createUserInputBuilder(props: Partial<CreateUserInput>): CreateUserInput {
    return userInputBuilder({ ...props });
}

export function updateUserInputBuilder(props: Partial<UpdateUserInput>): Required<UpdateUserInput> {
    return {
        id: props.id ?? randomUUID(),
        ...createUserInputBuilder({ ...props }),
        avatar: props.avatar
    };
}