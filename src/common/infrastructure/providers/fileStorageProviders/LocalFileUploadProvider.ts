import { injectable } from "tsyringe";
import type FileStorageProvider from "@/common/domain/providers/FileStorageProvider";
import type { FileStorageInput, FileStorageOutput } from "@/common/domain/providers/FileStorageProvider";
import fs from "fs/promises";
import path from "path";

@injectable()
export default class LocalFileStorageProvider implements FileStorageProvider {
    private readonly storageDirPath: string = path.resolve("uploads");

    public async upload(fileInput: FileStorageInput): Promise<FileStorageOutput> {
        const filePath: string = path.join(this.storageDirPath, fileInput.fileName);

        await fs.mkdir(this.storageDirPath, { recursive: true });
        await fs.writeFile(filePath, fileInput.content);

        return { path: filePath };
    };
}