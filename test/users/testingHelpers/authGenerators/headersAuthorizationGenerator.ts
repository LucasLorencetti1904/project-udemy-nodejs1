import { faker } from "@faker-js/faker";

export default function jwtGenerator(): string {
    return faker.internet.jwt();
}