import type StringHashProvider from "@/common/domain/providers/StringHashProvider";
import bcrypt from "bcryptjs";

export default class BcryptStringHashProvider implements StringHashProvider {
    public async hashString(str: string): Promise<string> {
        return await bcrypt.hash(str, 6);
    }

    public async compareWithHash(str: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(str, hash);
    }
}