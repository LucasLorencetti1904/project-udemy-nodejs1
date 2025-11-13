import env from "@/common/infrastructure/env/dotenv";
import Product from "@/products/infrastructure/typeorm/entities/Product";
import User from "@/users/infrastructure/typeorm/entities/User";
import { CreateProducts1757537584621 } from "@/common/infrastructure/typeorm/migrations/1757537584621-CreateProducts";
import { CreateUsers1762263461611 } from "@/common/infrastructure/typeorm/migrations/1762263461611-CreateUsers";
import { CreateUserTokens1763066651782 } from "@/common/infrastructure/typeorm/migrations/1763066651782-CreateUserTokens";
import { DataSourceOptions } from "typeorm";

const dbConfig: DataSourceOptions = {
    type: env.DB_TYPE,
    username: env.DB_USER,
    database: env.DB_NAME,
    host: env.DB_HOST,
    port: env.DB_PORT,
    schema: env.DB_SCHEMA,
    password: env.DB_PASS
};

const config: DataSourceOptions = {
    ...dbConfig,
    entities: [Product, User],
    migrations: [CreateProducts1757537584621, CreateUsers1762263461611, CreateUserTokens1763066651782]
};

export default config;