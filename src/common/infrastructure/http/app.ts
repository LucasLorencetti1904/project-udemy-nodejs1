import express from "express";
import cors from "cors";
import routes from "@/common/infrastructure/http/routes";
import ErrorHandler from "@/common/infrastructure/http/middlewares/ErrorHandler";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { OpenAPIV3 } from "openapi-types";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Documentation",
            version: "1.0.0",
        }
    },
    apis: ["./src/**/infraestructure/http/routes.ts"]
};

const swaggerSpec = swaggerJSDoc(options) as OpenAPIV3.Document;

const app = express();

app.use(cors());

app.use(express.json());

app.use(routes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(ErrorHandler.handle);

export default app;