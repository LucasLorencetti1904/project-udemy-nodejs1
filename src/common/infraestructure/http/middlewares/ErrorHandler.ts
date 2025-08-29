import HttpError from "@/common/domain/errors/httpErrors";
import { NextFunction, Request, Response } from "express";

export default class ErrorHandler {
    public static handle(e: Error, req: Request, res: Response, next: NextFunction): Response {
        if (e instanceof HttpError) {
            return res.status(e.statusCode).json({
                error: e.message
            });
        }
    
        console.error(e.message);
    
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
}