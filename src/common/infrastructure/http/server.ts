import app from "@/common/infrastructure/http/app";
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