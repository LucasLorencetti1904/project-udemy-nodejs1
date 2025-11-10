import type AuthenticationProvider from "@/common/domain/providers/AuthenticationProvider";
import type { TokenGenerationOutput, VerificationTokenOutput } from "@/common/domain/providers/AuthenticationProvider";
import JwtAuthenticationProvider from "@/common/infrastructure/providers/authenticationProviders/JwtAuthenticationProvider";
import { randomUUID, UUID } from "node:crypto";
import { UnauthorizedError } from "@/common/domain/errors/httpErrors";

let id: UUID;
let token: string;
let tokenRegex: RegExp;
let result: TokenGenerationOutput | VerificationTokenOutput;

const toTest: AuthenticationProvider[] = [
    new JwtAuthenticationProvider()
];

toTest.forEach((sut) => {
    describe (`${sut.constructor.name} Test.`, () => {
        it ("should generate a authentication web token from user id.", () => {
            id = randomUUID();
            result = sut.generateToken(id);

            expect (result).toEqual({ token: result.token });
            
            tokenRegex = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
            expect (tokenRegex.test(result.token)).toBeTruthy();
        });
    
        it ("should return user id when authentication web token is valid.", () => {
            id = randomUUID();
            token = sut.generateToken(id).token;

            result = sut.verifyToken(token);

            tokenRegex = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

            expect (result).toEqual({ userId: id });
        });
    
        ["abc.def", "invalid.token", "abc.def.ghi.jkl"].forEach((invalidToken) => {
            it ("should throw an UnauthorizedError when authentication web token is expired or invalid.", () => {    
                expect (() => sut.verifyToken(invalidToken)).toThrowError(UnauthorizedError);
            });
        });
    });
});