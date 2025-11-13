import ApplicationError from "@/common/domain/errors/ApplicationError";
import HttpError from "@/common/domain/errors/httpErrors";
import type { Request, Response } from "express";

export default abstract class Controller {
    public abstract handle(req: Request, res: Response): Promise<Response>;
    protected abstract validateRequest(data: unknown): unknown;

    protected handleResponseErr(res: Response, e: ApplicationError): Response {
        return res.status(
            e instanceof HttpError
                ? e.statusCode
                : 400
        ).json({ message: e.message });
    }
}