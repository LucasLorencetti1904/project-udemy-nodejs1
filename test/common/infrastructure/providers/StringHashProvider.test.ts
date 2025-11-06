import StringHashProvider from "@/common/domain/providers/StringHashProvider";
import bcrypt from "bcryptjs";

let str: string;
let hash: string;
let result: string;

const toTest: StringHashProvider[] = [
    new BcryptStringHashProvider()
];

toTest.forEach((sut) => {
    describe (`${sut.name} Test.`, () => {
        it ("should generate a hash from string.", () => {
            str = "String example";
            result = sut.hash(str);
            expect (result).not.toBe(str);
        });
    
        it ("should return true when string matches hash.", () => {
            str = "String example";
            hash = sut.hash(str);
            result = sut.compare(str, hash);
            expect (result).toBe(true);
        });
    
        it ("should return false when string does not match hash.", () => {
            str = "String example";
            result = sut.compare(str, "Other string example");
            expect (result).toBe(false);
        });
    });
});