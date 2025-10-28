import { DataSource } from "typeorm";
import config from "@/common/infrastructure/typeorm/config/options";

const testingDataSource: DataSource = new DataSource({
    ...config,
    synchronize: true,
    logging: true
});

export default testingDataSource;