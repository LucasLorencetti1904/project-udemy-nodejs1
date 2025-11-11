export type FileStorageInput = {
    fileName: string,
    fileType: string,
    fileSize: number,
    content: Buffer
};

export type FileStorageOutput =
    | { path: string, url?: never }
    | { url: string, path?: never }

export default interface FileStorageProvider {
    storage(fileInput: FileStorageInput): Promise<FileStorageOutput>;
}