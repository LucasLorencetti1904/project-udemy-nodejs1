import productRouter from "@/products/infrastructure/http/routes/productRoutes";
import { Router } from "express";
import type { Request, Response } from "express";

const routes = Router();

routes.get("/", (req: Request, res: Response) => {
    return res.status(200).json({ message: "Hello World!" });
});

routes.use("/products", productRouter);

export default routes;