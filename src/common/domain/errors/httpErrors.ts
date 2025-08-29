export default abstract class HttpError extends Error {
    public abstract readonly statusCode: number;
}

export class BadRequestError extends HttpError {
    public statusCode: number = 400;
}