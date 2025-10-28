import { createProductController } from "@/main";
import { Router } from "express";

const productRouter: Router = Router();

productRouter.post("/", createProductController.handle);

export default productRouter;