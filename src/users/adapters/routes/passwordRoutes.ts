import { container } from "tsyringe";
import { Router } from "express";
import RequestUserPasswordResetController from "@/users/adapters/controllers/RequestUserPasswordResetController";

const passwordRouter: Router = Router();

const requestUserPasswordResetController: RequestUserPasswordResetController = container.resolve(RequestUserPasswordResetController);

passwordRouter.post("/forgot", requestUserPasswordResetController.handle );

export default passwordRouter;