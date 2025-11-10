import type { NextFunction, Request, Response } from "express";
import type AuthenticationProvider from "@/common/domain/providers/AuthenticationProvider";
import JwtAuthenticationProvider from "@/common/infrastructure/providers/authenticationProviders/JwtAuthenticationProvider";
import { container } from "tsyringe";
import { UnauthorizedError } from "@/common/domain/errors/httpErrors";

export default class AuthorizationMiddleware {
    public static handle = (req: Request, _res: Response, next: NextFunction): void => {
        const authHeader: string = req.headers.authorization;
    
        if (!authHeader) {
            throw new UnauthorizedError("Token is missing.");
        }
    
        const [, token] = authHeader.split(" ");
    
        const authProvider: AuthenticationProvider = container.resolve(JwtAuthenticationProvider);
    
        const { userId } = authProvider.verifyToken(token);
    
        req.authUserId = userId;
    
        return next();
    };
}