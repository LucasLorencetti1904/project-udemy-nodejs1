import { z, ZodSafeParseResult } from "zod";
import dotenv from "dotenv";
import ApplicationError from "@/common/domain/errors/ApplicationErrors";

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(3000),
    API_URL: z.string().default("http://localhost:3000")
});

type Env = z.infer<typeof envSchema>;

const _env: ZodSafeParseResult<Env> = envSchema.safeParse(process.env);

if (!_env.success) {
    const message: string = `Invalid environment variables.\n${_env.error.message}`;
    console.error(message);
    throw new ApplicationError(message);
}

const env: Env = _env.data;

export default env;