import app from "@/common/infraestructure/http/app";

const port: number = 3000;

app.listen(port, () => {
    console.log("Server Running...");
});