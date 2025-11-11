import { faker } from "@faker-js/faker";

export default class TestingMiscGenerator {
    public static jwt(): string {
        return faker.internet.jwt();
    }

    public static buffer(len: number): Buffer {
        const bytes: Uint8Array = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = i % 256;
        }
        return Buffer.from(bytes);
    }

    public static fileName(): string {
        return faker.system.fileName();
    }

    public static fileType(): string {
        return faker.system.fileType();
    }

    public static randomNumber(min: number, max:     number): number {
        return faker.number.int({ min, max });
    }
}