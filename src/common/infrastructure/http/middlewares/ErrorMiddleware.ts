import type { NextFunction, Request, Response } from "express";
import HttpError from "@/common/domain/errors/httpErrors";

export default class ErrorMiddleware {
    public static handle = (e: Error, _req: Request, res: Response, _next: NextFunction): Response => {
        if (e instanceof HttpError) {
            return res.status(e.statusCode).json({
                error: e.message
            });
        }
    
        console.error(e.message);
    
        return res.status(500).json({ error: "Internal Server Error" });
    };
}