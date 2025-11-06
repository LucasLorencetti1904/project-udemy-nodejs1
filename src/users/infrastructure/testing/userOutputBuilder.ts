import { updateUserInputBuilder } from "@/users/infrastructure/testing/userInputBuilder";
import type { UserOutput } from "@/users/application/dto/userIo";

export default function userOutputBuilder(props: Partial<UserOutput>): UserOutput {
    return {
        ...updateUserInputBuilder({ ...props }),
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date()
    };
}