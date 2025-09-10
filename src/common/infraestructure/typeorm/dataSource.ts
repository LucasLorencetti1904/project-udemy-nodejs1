import { DataSource } from "typeorm";
import env from "@/common/infraestructure/env/dotenv";
import { DataSourceOptions } from "typeorm/browser";

const dbConfig: DataSourceOptions = {
    type: env.DB_TYPE,
    username: env.DB_USER,
    database: env.DB_DATABASE,
    host: env.DB_HOST,
    port: env.DB_PORT,
    schema: env.DB_SCHEMA,
    password: env.DB_PASSWORD
};

const dataSource: DataSource = new DataSource({
    ...dbConfig,
    entities: ["**/entities/**/*.ts"],
    migrations: ["**/migrations/**/*.ts"],
    synchronize: false,
    logging: false
});

export default dataSource;