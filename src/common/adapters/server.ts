import app from "@/common/adapters/app";
import env from "@/common/infrastructure/env/dotenv";
import dataSource from "@/common/infrastructure/typeorm/config/dataSource";

dataSource.initialize()
    .then(() => {
        app.listen(env.PORT, () => {
            console.log(`[${env.PORT}] Server Running...`);
        });
    })
    .catch((err: Error) => {
        console.error(`Typeorm syncronization error: ${err}`);
    });