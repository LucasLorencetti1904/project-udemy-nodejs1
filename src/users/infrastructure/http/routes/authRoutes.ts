import { container } from "tsyringe";
import { Router } from "express";
import AuthenticateUserController from "@/users/infrastructure/http/controllers/AuthenticateUserController";

const authRouter: Router = Router();

const authenticateUserController: AuthenticateUserController = container.resolve(AuthenticateUserController);

authRouter.post("/login", authenticateUserController.handle);

export default authRouter;