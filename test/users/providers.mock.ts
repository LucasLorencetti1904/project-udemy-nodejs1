import type UserRepository from "@/users/domain/repositories/UserRepository";
import type StringHashProvider from "@/common/domain/providers/StringHashProvider";
import type AuthenticationProvider from "@/common/domain/providers/AuthenticationProvider";
import type FileStorageProvider from "@/common/domain/providers/FileStorageProvider";
import { FileStorageInput, FileStorageOutput } from "@/common/domain/providers/FileStorageProvider";

export class MockUserRepository implements UserRepository {
    public findById = vi.fn();
    public findByName = vi.fn();
    public findByEmail = vi.fn();
    public create = vi.fn();
    public update = vi.fn();
    public delete = vi.fn();
    public insert = vi.fn();
    public search = vi.fn();
}

export class MockStringHashProvider implements StringHashProvider {
    public compareWithHash = vi.fn();
    public hashString = vi.fn();
}

export class MockAuthenticationProvider implements AuthenticationProvider {
    public generateToken = vi.fn();
    public verifyToken = vi.fn();
}

export class MockFileStorageProvider implements FileStorageProvider {
    public storage = vi.fn();
}