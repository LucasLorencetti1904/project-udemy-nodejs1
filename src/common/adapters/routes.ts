import productRouter from "@/products/adapters/routes/productRoutes";
import userRouter from "@/users/adapters/routes/userRoutes";
import authRouter from "@/users/adapters/routes/authRoutes";
import { Router } from "express";
import type { Request, Response } from "express";

const routes = Router();

routes.get("/", (req: Request, res: Response) => {
    return res.status(200).json({ message: "Hello World!" });
});

routes.use("/products", productRouter);

routes.use("/users", userRouter);

routes.use("/auth", authRouter);

export default routes;