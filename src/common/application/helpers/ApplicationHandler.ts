import HttpError, { InternalError } from "@/common/domain/errors/httpErrors";

export default class ApplicationHandler {
    public static handleErrors(e: unknown) {
        if (e instanceof HttpError) {
            throw e;
        }
        throw new InternalError(e instanceof Error ? e.message : String(e));
    }
}