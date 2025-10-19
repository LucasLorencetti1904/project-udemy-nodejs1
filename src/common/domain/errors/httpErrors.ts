import ApplicationError from "@/common/domain/errors/ApplicationErrors";

export default abstract class HttpError extends ApplicationError {
    public abstract readonly statusCode: number;
}

export class BadRequestError extends HttpError {
    public readonly statusCode: number = 400;
}

export class NotFoundError extends HttpError {
    public readonly statusCode: number = 404;
}

export class ConflictError extends HttpError {
    public readonly statusCode: number = 409;
}