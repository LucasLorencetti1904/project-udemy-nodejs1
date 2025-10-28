import config from "@/common/infrastructure/typeorm/config/options";
import { DataSource } from "typeorm";

const dataSource: DataSource = new DataSource({
    ...config,
    synchronize: false,
    logging: false
});

export default dataSource;