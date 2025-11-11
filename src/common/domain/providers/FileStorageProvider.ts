export type FileStorageInput = {
    fileName: string,
    content: Buffer
};

export type FileStorageOutput =
    | { path: string, url?: never }
    | { url: string, path?: never }

export default interface FileStorageProvider {
    storage(fileInput: FileStorageInput): Promise<FileStorageOutput>;
}