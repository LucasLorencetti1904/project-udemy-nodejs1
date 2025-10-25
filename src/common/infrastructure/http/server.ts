import app from "@/common/infrastructure/http/app";
import env from "@/common/infrastructure/env/dotenv"
import { dataSource } from "@/common/infrastructure/typeorm/dataSource";

const port: number = 3000;

dataSource.initialize()
    .then(() => {
        app.listen(port, () => {
            console.log(`[${env.PORT}] Server Running...`);
            console.log(`API Documentantion available at GET / docs`);
        });
    })
    .catch((err: Error) => {
        console.error(`Typeorm syncronization error: ${err}`);
    });
