import { faker } from "@faker-js/faker";

export default class TestingJwtGenerator {
    public static generate(): string {
        return faker.internet.jwt();
    }
}