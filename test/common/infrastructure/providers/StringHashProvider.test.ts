import type StringHashProvider from "@/common/domain/providers/StringHashProvider";
import BcryptStringHashProvider from "@/common/infrastructure/providers/stringHashProviders/BcryptStringHashProvider";

let str: string;
let hash: string;
let result: string | boolean;

const toTest: StringHashProvider[] = [
    new BcryptStringHashProvider()
];

toTest.forEach((sut) => {
    describe (`${sut.constructor.name} Test.`, () => {
        it ("should generate a hash from string.", async () => {
            str = "String example";
            result = await sut.hashString(str);

            expect (result && result != str).toBeTruthy();
        });
    
        it ("should return true when string matches hash.", async () => {
            str = "String example";
            hash = await sut.hashString(str);
            result = await sut.compareWithHash(str, hash);

            expect (result).toBeTruthy();
        });
    
        it ("should return false when string does not match hash.", async () => {
            str = "String example";
            result = await sut.compareWithHash(str, "Other string example");

            expect (result).toBeFalsy();
        });
    });
});