import { z, ZodSafeParseResult } from "zod";
import dotenv from "dotenv";
import ApplicationError from "@/common/domain/errors/ApplicationErrors";

dotenv.config();

const db: "postgres" | "mysql" | "sqlite" = "postgres";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(3000),
    API_URL: z.string().default("http://localhost:3000"),
    DB_TYPE: z.literal(db).default(db),
    DB_HOST: z.string().default("localhost"),
    DB_PORT: z.coerce.number().default(5432),
    DB_SCHEMA: z.string().default("public"),
    DB_NAME: z.string().default(db),
    DB_USER: z.string().default(db),
    DB_DATABASE: z.string().default(db),
    DB_PASSWORD: z.string().default(db)
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