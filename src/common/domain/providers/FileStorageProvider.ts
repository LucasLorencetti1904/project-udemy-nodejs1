export type StorageFileInput = {
    name: string,
    type: string,
    size: number,
    content: Buffer
};

export type FileName = string

export default interface FileStorageProvider {
    storage(fileInput: StorageFileInput): Promise<FileName>;
}