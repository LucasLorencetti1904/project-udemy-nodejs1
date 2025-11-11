import { injectable } from "tsyringe";
import type FileStorageProvider from "@/common/domain/providers/FileStorageProvider";
import type { FileStorageInput, FileStorageOutput } from "@/common/domain/providers/FileStorageProvider";
import fs from "fs/promises";
import path from "path";

@injectable()
export default class LocalFileStorageProvider implements FileStorageProvider {
    private readonly relativeStorageDirPath: string = "uploads/user/avatar";
    private readonly absoluteStorageDirPath: string = path.resolve(this.relativeStorageDirPath);

    public async storage({ fileName, content }: FileStorageInput): Promise<FileStorageOutput> {
        if (fileName == "") {
            throw new Error("File name cannot be empty.");
        }

        const filePath: string = path.join(this.absoluteStorageDirPath, fileName);

        await fs.mkdir(this.absoluteStorageDirPath, { recursive: true });
        await fs.writeFile(filePath, content);

        return { path: path.join(this.relativeStorageDirPath, fileName) };
    };
}