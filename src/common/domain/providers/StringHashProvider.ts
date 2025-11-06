export default interface StringHashProvider {
    hashString(str: string): Promise<string>;
    compareHash(str: string, hash: string): Promise<boolean>;
}