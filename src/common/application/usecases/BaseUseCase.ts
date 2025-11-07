import HttpError, { InternalError } from "@/common/domain/errors/httpErrors";

export default abstract class BaseUseCase {
    protected handleApplicationErrors(e: unknown) {
        if (e instanceof HttpError) {
            throw e;
        }
        throw new InternalError(e instanceof Error ? e.message : String(e));
    }
}