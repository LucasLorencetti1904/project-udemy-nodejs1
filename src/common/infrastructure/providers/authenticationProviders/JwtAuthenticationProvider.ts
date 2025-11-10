import { UnauthorizedError } from "@/common/domain/errors/httpErrors";
import type AuthenticationProvider from "@/common/domain/providers/AuthenticationProvider";
import type { TokenGenerationOutput, VerificationTokenOutput } from "@/common/domain/providers/AuthenticationProvider";
import env from "@/common/infrastructure/env/dotenv";
import jwt from "jsonwebtoken";

export default class JwtAuthenticationProvider implements AuthenticationProvider {
    public generateToken(userId: string): TokenGenerationOutput {
        const token: string = jwt.sign({}, env.JWT_SECRET, {
            expiresIn: env.JWT_EXPIRES_IN,
            subject: userId
        });

        return { token };
    }

    public verifyToken(token: string): VerificationTokenOutput {
        try {
            const { sub } = jwt.verify(token, env.JWT_SECRET);

            return { userId: sub.toString() };
        }

        catch {
            throw new UnauthorizedError("Token is expired or invalid.");
        }
    }
}