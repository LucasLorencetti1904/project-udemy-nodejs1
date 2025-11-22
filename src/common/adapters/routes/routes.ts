import productRouter from "@/products/adapters/routes/productRoutes";
import userRouter from "@/users/adapters/routes/userRoutes";
import authRouter from "@/users/adapters/routes/authRoutes";
import passwordRouter from "@/users/adapters/routes/passwordRoutes";
import { Router } from "express";

const routes = Router();

routes.use("/products", productRouter);

routes.use("/users", userRouter);

routes.use("/auth", authRouter);

routes.use("/password", passwordRouter);

export default routes;