import config from "@/common/infrastructure/typeorm/config/options";
import { DataSource } from "typeorm";

const testingDataSource: DataSource = new DataSource({
    ...config,
    synchronize: true,
    logging: true
});

export default testingDataSource;