import ApplicationError from "@/common/domain/errors/ApplicationError";
import { ZodType } from "zod";

type DataWithSchema = {
    data: any,
    schema: ZodType<any>;
};

export default class ZodSchemaValidator {
    public static handleDataWithSchema({ data, schema }: DataWithSchema): any {
        const result = schema.safeParse(data);

        if (!result.success) {
            throw new ApplicationError(`${result.error.issues.map((err) => {
                return `${err.path.join(".")} -> ${err.message}`;
            }).join(`, `)}`);
        }

        return result.data;
    }
}