import app from "@/common/infraestructure/http/app";
import env from "@/common/infraestructure/env/dotenv"
import dataSource from "@/common/infraestructure/typeorm/dataSource";

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
