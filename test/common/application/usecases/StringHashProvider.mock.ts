import type StringHashProvider from "@/common/domain/providers/StringHashProvider";

export default class MockStringHashProvider implements StringHashProvider {
    public compareWithHash = vi.fn();
    public hashString = vi.fn();
}