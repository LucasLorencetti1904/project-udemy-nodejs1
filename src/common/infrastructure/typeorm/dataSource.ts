import { DataSource, DataSourceOptions } from "typeorm";
import env from "@/common/infrastructure/env/dotenv";
import Product from "@/products/infrastructure/typeorm/entities/Product";
import { CreateProducts1757537584621 } from "./migrations/1757537584621-CreateProducts";

const dbConfig: DataSourceOptions = {
    type: env.DB_TYPE,
    username: env.DB_USER,
    database: env.DB_DATABASE,
    host: env.DB_HOST,
    port: env.DB_PORT,
    schema: env.DB_SCHEMA,
    password: env.DB_PASS
};

const config: DataSourceOptions = {
    ...dbConfig,
    entities: [Product],
    migrations: [CreateProducts1757537584621]
};

export const dataSource: DataSource = new DataSource({
    ...config,
    synchronize: false,
    logging: false
});

export const testingDataSource: DataSource = new DataSource({
    ...config,
    synchronize: true,
    logging: true
});