import { inject, injectable } from "tsyringe";
import ControllerHandler from "@/common/adapters/helpers/ControllerHandler";
import type ExpressController from "@/common/adapters/controllers/ExpressController";
import z from "zod";
import type { ZodType } from "zod";
import ZodSchemaValidator from "@/common/adapters/helpers/ZodSchemaValidator";
import type { Request, Response } from "express";
import ApplicationError from "@/common/domain/errors/ApplicationError";
import ResetUserPasswordUseCase from "@/users/application/usecases/resetUserPassword/ResetUserPasswordUseCase";
import ResetUserPasswordInput from "@/users/application/dto/ResetUserPasswordInput";

@injectable()
export default class ResetUserPasswordController implements ExpressController {
    constructor (
        @inject("ResetUserPasswordUseCase") 
        private readonly useCase: ResetUserPasswordUseCase
    ) {}

    public handle = async (req: Request, res: Response): Promise<Response> => {
        try {
            const input: ResetUserPasswordInput = this.validateRequest(req.body);
            await this.useCase.execute(input);
            return res.status(204).json({ message: "Token generated successfully." });
        }
        catch(e: unknown) {
            return ControllerHandler.handleResponseError(res, e as ApplicationError);
        }
    }

    protected validateRequest(data: ResetUserPasswordInput): ResetUserPasswordInput {
        const schema: ZodType<ResetUserPasswordInput> = z.object({
            token: z.string().nonempty(),
            newPassword: z.string().nonempty()
        }).strict();

        return ZodSchemaValidator.validateDataWithSchema({ data, schema });
    }   
}