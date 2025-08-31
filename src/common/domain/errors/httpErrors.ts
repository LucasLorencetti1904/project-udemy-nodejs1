import ApplicationError from "@/common/domain/errors/ApplicationErrors";

export default abstract class HttpError extends ApplicationError {
    public abstract readonly statusCode: number;
}

export class BadRequestError extends HttpError {
    public statusCode: number = 400;
}