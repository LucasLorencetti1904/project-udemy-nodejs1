import ApplicationError from "@/common/domain/errors/ApplicationError";
import HttpError from "@/common/domain/errors/httpErrors";
import { ZodError } from "zod";
import type { Request, Response } from "express";

export default abstract class Controller {
    public abstract handle(req: Request, res: Response): Promise<Response>;
    protected abstract handleRequest(data: unknown): any;

    protected handleResponseErr(res: Response, e: ApplicationError): Response {
        return res.status(
            e instanceof HttpError
                ? e.statusCode
                : 400
        ).json({ message: e.message });
    }

    protected ThrowZodError(result: ZodError): never {
        throw new ApplicationError(`${result.issues.map((err) => {
            return `${err.path.join(".")} -> ${err.message}`;
        }).join(`, `)}`);
    }
}