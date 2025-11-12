import type FileStorageProvider from "@/common/domain/providers/FileStorageProvider";
import LocalFileStorageProvider from "@/common/infrastructure/providers/fileStorageProviders/LocalFileStorageProvider";
import type { StorageFileInput, FileStorageReference } from "@/common/domain/providers/FileStorageProvider";
import TestingMiscGenerator from "test/users/testingHelpers/authGenerators/TestingMiscGenerator";
import fs from "fs/promises";
import path from "path";

async function exists(path: string): Promise<boolean> {
    return fs.access(path).then(() => true).catch(() => false);
}

let sut: FileStorageProvider;

let input: StorageFileInput;
let result: FileStorageReference;

const relativeStorageDirPath: string = "testingUploads/user/avatar";
const absoluteStorageDirPath: string = path.resolve(relativeStorageDirPath);

describe ("LocalFileStorageProvider Test.", () => {
    beforeEach (async () => {
        sut = new LocalFileStorageProvider();

        sut["relativeStorageDirPath"] = relativeStorageDirPath;
        sut["absoluteStorageDirPath"] = absoluteStorageDirPath;

        const randomSize: number = TestingMiscGenerator.randomNumber(1, 1024 * 1024 * 3)

        input = {
            name: TestingMiscGenerator.fileName(),
            content: TestingMiscGenerator.buffer(randomSize)
        } as StorageFileInput;
    });

    afterEach(async () => {
        if ( await exists(absoluteStorageDirPath)) {
            await fs.rm(absoluteStorageDirPath, { recursive: true });
        }
    });

    it ("should throw an error when file name is empty.", async () => {
        input.name = "";

        await expect (sut.storage(input)).rejects.toBeInstanceOf(Error);
    });

    it ("should create directory with file if it does not already exists.", async () => {
        await sut.storage(input);
        
        const absoluteFilePath: string = path.join(absoluteStorageDirPath, input.name);
        const fileWasCreated: boolean = await exists(absoluteFilePath);

        expect (fileWasCreated).toBeTruthy();
    });

    it ("should create directory with file if it does not already exists.", async () => {
        await sut.storage(input);
        
        const absoluteFilePath: string = path.join(absoluteStorageDirPath, input.name);
        const fileWasCreated: boolean = await exists(absoluteFilePath);

        expect (fileWasCreated).toBeTruthy();
    });

    it ("should overwrite a file if the new file has the same name.", async () => {
        input.content = TestingMiscGenerator.buffer(846);
        await sut.storage(input);

        input.content = TestingMiscGenerator.buffer(321);
        await sut.storage(input);
        
        const absoluteFilePath: string = path.join(absoluteStorageDirPath, input.name);

        const fileSize: number = (await fs.stat(absoluteFilePath)).size;

        expect (fileSize).toBe(321);
    });

    it ("should preserve the exact buffer size in file.", async () => {
        result = await sut.storage(input);
        
        const absoluteFilePath: string = path.join(absoluteStorageDirPath, input.name);
        const fileSize: number = (await fs.stat(absoluteFilePath)).size;

        expect (fileSize).toBe(input.content.length);
    });

    it ("should return relative path of created file.", async () => {
        result = await sut.storage(input);
        
        const relativeFilePath: string = path.join(relativeStorageDirPath, input.name);

        expect (result).toBe(relativeFilePath);
    });
});