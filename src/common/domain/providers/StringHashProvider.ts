export default interface StringHashProvider {
    hashString(str: string): Promise<string>;
    compareWithHash(str: string, hash: string): Promise<boolean>;
}