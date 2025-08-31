import app from "@/common/infraestructure/http/app";
import env from "@/common/infraestructure/env/dotenv"

const port: number = 3000;

app.listen(port, () => {
    console.log(`[${env.PORT}] Server Running...`);
    console.log(`API Documentantion available at GET / docs`);
});