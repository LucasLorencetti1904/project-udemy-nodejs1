import ApplicationError from "@/common/domain/errors/ApplicationError";
import HttpError from "@/common/domain/errors/httpErrors";
import type { Response } from "express";

export default class ControllerHandler {
    public static handleResponseError(res: Response, e: ApplicationError): Response {
        return res.status(
            e instanceof HttpError
                ? e.statusCode
                : 400
        ).json({ message: e.message });
    }
}