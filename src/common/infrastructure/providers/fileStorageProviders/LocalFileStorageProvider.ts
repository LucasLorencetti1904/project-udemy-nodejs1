import { injectable } from "tsyringe";
import type FileStorageProvider from "@/common/domain/providers/FileStorageProvider";
import type { StorageFileInput, FileName } from "@/common/domain/providers/FileStorageProvider";
import fs from "fs/promises";
import path from "path";

@injectable()
export default class LocalFileStorageProvider implements FileStorageProvider {
    private readonly storageDirPath: string = path.resolve("uploads/user/avatar");

    public async storage({ name, content }: StorageFileInput): Promise<FileName> {
        if (name == "") {
            throw new Error("File name cannot be empty.");
        }

        const filePath: string = path.join(this.storageDirPath, name);

        await fs.mkdir(this.storageDirPath, { recursive: true });
        await fs.writeFile(filePath, content);

        return name;
    };
}