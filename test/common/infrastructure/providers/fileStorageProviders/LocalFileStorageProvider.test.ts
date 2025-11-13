import type FileStorageProvider from "@/common/domain/providers/FileStorageProvider";
import LocalFileStorageProvider from "@/common/infrastructure/providers/fileStorageProviders/LocalFileStorageProvider";
import type { StorageFileInput, FileName } from "@/common/domain/providers/FileStorageProvider";
import TestingMiscGenerator from "test/users/testingHelpers/authGenerators/TestingMiscGenerator";
import fs from "fs/promises";
import path from "path";

async function exists(path: string): Promise<boolean> {
    return fs.access(path).then(() => true).catch(() => false);
}

let sut: FileStorageProvider;

let input: StorageFileInput;
let result: FileName;

const storageDirPath: string = path.resolve("testingUploads/user/avatar");

describe ("LocalFileStorageProvider Test.", () => {
    beforeEach (async () => {
        sut = new LocalFileStorageProvider();

        sut["storageDirPath"] = storageDirPath;

        const randomSize: number = TestingMiscGenerator.randomNumber(1, 1024 * 1024 * 3)

        input = {
            name: TestingMiscGenerator.fileName(),
            content: TestingMiscGenerator.buffer(randomSize)
        } as StorageFileInput;
    });

    afterEach(async () => {
        if ( await exists(storageDirPath)) {
            await fs.rm(storageDirPath, { recursive: true });
        }
    });

    it ("should throw an error when file name is empty.", async () => {
        input.name = "";

        await expect (sut.storage(input)).rejects.toBeInstanceOf(Error);
    });

    it ("should create directory with file if it does not already exists.", async () => {
        await sut.storage(input);
        
        const filePath: string = path.join(storageDirPath, input.name);
        const fileWasCreated: boolean = await exists(filePath);

        expect (fileWasCreated).toBeTruthy();
    });

    it ("should overwrite a file if the new file has the same name.", async () => {
        input.content = TestingMiscGenerator.buffer(846);
        await sut.storage(input);

        input.content = TestingMiscGenerator.buffer(321);
        await sut.storage(input);
        
        const filePath: string = path.join(storageDirPath, input.name);

        const fileSize: number = (await fs.stat(filePath)).size;

        expect (fileSize).toBe(321);
    });

    it ("should preserve the exact buffer size in file.", async () => {
        await sut.storage(input);
        
        const filePath: string = path.join(storageDirPath, input.name);
        const fileSize: number = (await fs.stat(filePath)).size;

        expect (fileSize).toBe(input.content.length);
    });

    it ("should return relative path of created file.", async () => {
        result = await sut.storage(input);
        
        expect (result).toBe(input.name);
    });
});