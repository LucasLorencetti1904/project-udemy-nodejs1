import { container } from "tsyringe";
import { Router } from "express";
import ResetUserPasswordWithEmailController from "@/users/adapters/controllers/ResetUserPasswordWithEmailController";

const passwordRouter: Router = Router();

const resetUserPasswordWithEmailController: ResetUserPasswordWithEmailController = container.resolve(ResetUserPasswordWithEmailController);

passwordRouter.post("/forgot", resetUserPasswordWithEmailController.handle );

export default passwordRouter;