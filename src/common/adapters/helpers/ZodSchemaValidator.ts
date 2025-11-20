import ApplicationError from "@/common/domain/errors/ApplicationError";
import type { ZodType } from "zod";

type DataWithSchema<TRequest> = {
    data: TRequest,
    schema: ZodType<TRequest>;
};

export default class ZodSchemaValidator {
    public static validateDataWithSchema<TRequest>({ data, schema }: DataWithSchema<TRequest>): TRequest {
        const result = schema.safeParse(data);

        if (!result.success) {
            throw new ApplicationError(`${result.error.issues.map((err) => {
                return `${err.path.join(".")} -> ${err.message}`;
            }).join(`, `)}`);
        }

        return result.data;
    }
}