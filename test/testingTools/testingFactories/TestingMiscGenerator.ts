import { faker } from "@faker-js/faker";
import type TestModel from "test/testingTools/testingTypes/TestModel";
import { randomUUID } from "node:crypto";
import TestProps from "test/testingTools/testingTypes/TestProps";

export default class TestingMiscGenerator {
    public static testingProps(props: Partial<TestProps>): TestProps {
        return {
            modelString: props.modelString ?? faker.string.alpha(),
            modelNumber: props.modelNumber ?? faker.number.int(),
            modelBoolean: props.modelBoolean ?? faker.datatype.boolean(),
        };
    }

    public static testingModel(props: Partial<TestModel>): TestModel {
        return {
            id: props.id ?? randomUUID(),
            ...this.testingProps(props),
            createdAt: props.createdAt ?? new Date(),
            updatedAt: props.updatedAt ?? new Date()            
        };
    }

    public static jwt(): string {
        return faker.internet.jwt();
    }

    public static partialMulterFile(props: Partial<Omit<Express.Multer.File, "buffer">>): Partial<Express.Multer.File> {
        const fileBuffer: Buffer = this.buffer(props.size ?? 10);
        return {
            originalname: props.originalname ?? faker.system.fileName(),
            mimetype: props.mimetype ?? faker.system.mimeType(),
            size: fileBuffer.length,
            buffer: fileBuffer,
        };
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