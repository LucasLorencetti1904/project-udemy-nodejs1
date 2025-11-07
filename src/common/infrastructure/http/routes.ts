import productRouter from "@/products/infrastructure/http/routes/productRoutes";
import userRouter from "@/users/infrastructure/http/routes/userRoutes";
import { Router } from "express";
import type { Request, Response } from "express";

const routes = Router();

routes.get("/", (req: Request, res: Response) => {
    return res.status(200).json({ message: "Hello World!" });
});

routes.use("/products", productRouter);

routes.use("/users", userRouter);

export default routes;