import { inject, injectable } from "tsyringe";
import ControllerHandler from "@/common/adapters/helpers/ControllerHandler";
import type ExpressController from "@/common/adapters/controllers/ExpressController";
import type ResetUserPasswordWithEmailUseCase from "@/users/application/usecases/resetUserPasswordWithEmail/ResetUserPasswordWithEmailUseCase";
import type { ResetUserPasswordWithEmailInput, ResetUserPasswordWithEmailOutput } from "@/users/application/dto/ResetUserPasswordWithEmailIo";
import z from "zod";
import type { ZodType } from "zod";
import ZodSchemaValidator from "@/common/adapters/helpers/ZodSchemaValidator";
import type { Request, Response } from "express";
import ApplicationError from "@/common/domain/errors/ApplicationError";

@injectable()
export default class ResetUserPasswordWithEmailController implements ExpressController {
    constructor (
        @inject("ResetUserPasswordWithEmailUseCase") 
        private readonly useCase: ResetUserPasswordWithEmailUseCase
    ) {}

    public handle = async (req: Request, res: Response): Promise<Response> => {
        try {
            const input: ResetUserPasswordWithEmailInput = this.validateRequest(req.body);
            const output: ResetUserPasswordWithEmailOutput = await this.useCase.execute(input);
            return res.status(201).json({ message: "Token generated successfully.", data: output });
        }
        catch(e: unknown) {
            return ControllerHandler.handleResponseError(res, e as ApplicationError);
        }
    }

    protected validateRequest(data: ResetUserPasswordWithEmailInput): ResetUserPasswordWithEmailInput {
        const schema: ZodType<ResetUserPasswordWithEmailInput> = z.object({
            email: z.string().email()
        }).strict();

        return ZodSchemaValidator.validateDataWithSchema({ data, schema });
    }   
}