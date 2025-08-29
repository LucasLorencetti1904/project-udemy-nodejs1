import express from "express";
import cors from "cors";
import routes from "@/common/infraestructure/http/routes";
import ErrorHandler from "@/common/infraestructure/http/middlewares/ErrorHandler";

const app = express();

app.use(cors());

app.use(express.json());

app.use(routes);

app.use(ErrorHandler.handle);

export default app;