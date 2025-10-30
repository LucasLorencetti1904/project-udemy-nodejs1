import ApplicationError from "@/common/domain/errors/ApplicationError";
import HttpError from "@/common/domain/errors/httpErrors";
import { ZodSafeParseResult } from "zod";
import type { Request, Response } from "express";

export default abstract class Controller {
    public abstract handle(req: Request, res: Response): Promise<Response>;
    protected abstract validate(data: unknown): void;

    protected handleResponseErr(res: Response, e: ApplicationError): Response {
        return res.status(
            e instanceof HttpError
                ? e.statusCode
                : 400
        ).json({ message: e.message });
    }

    protected handleZodResult(result: ZodSafeParseResult<unknown>): void {
        if (result.success) {
            return;
        }
        throw new ApplicationError(`${result.error.issues.map((err) => {
            return `${err.path.join(".")} -> ${err.message}`;
        }).join(`, `)}`);
    }
}