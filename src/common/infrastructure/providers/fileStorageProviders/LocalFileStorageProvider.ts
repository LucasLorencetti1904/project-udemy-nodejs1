import { injectable } from "tsyringe";
import type FileStorageProvider from "@/common/domain/providers/FileStorageProvider";
import type { StorageFileInput, FileStorageReference } from "@/common/domain/providers/FileStorageProvider";
import fs from "fs/promises";
import path from "path";

@injectable()
export default class LocalFileStorageProvider implements FileStorageProvider {
    private readonly relativeStorageDirPath: string = "uploads/user/avatar";
    private readonly absoluteStorageDirPath: string = path.resolve(this.relativeStorageDirPath);

    public async storage({ name, content }: StorageFileInput): Promise<FileStorageReference> {
        if (name == "") {
            throw new Error("File name cannot be empty.");
        }

        const filePath: string = path.join(this.absoluteStorageDirPath, name);

        await fs.mkdir(this.absoluteStorageDirPath, { recursive: true });
        await fs.writeFile(filePath, content);

        return path.join(this.relativeStorageDirPath, name);
    };
}