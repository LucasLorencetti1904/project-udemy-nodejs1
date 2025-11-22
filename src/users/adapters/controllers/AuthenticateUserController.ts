import { inject, injectable } from "tsyringe";
import ControllerHandler from "@/common/adapters/helpers/ControllerHandler";
import type ExpressController from "@/common/adapters/controllers/ExpressController";
import type AuthenticateUserUseCase from "@/users/application/usecases/authenticateUser/AuthenticateUserUseCase";
import type { AuthenticateUserInput, AuthenticateUserOutput } from "@/users/application/dto/userDto/authenticateUserIo";
import z from "zod";
import type { ZodType } from "zod";
import ZodSchemaValidator from "@/common/adapters/helpers/ZodSchemaValidator";
import type { Request, Response } from "express";
import ApplicationError from "@/common/domain/errors/ApplicationError";

@injectable()
export default class AuthenticateUserController implements ExpressController {
    constructor (
        @inject("AuthenticateUserUseCase") 
        private readonly useCase: AuthenticateUserUseCase
    ) {}

    public handle = async (req: Request, res: Response): Promise<Response> => {
        try {
            const input: AuthenticateUserInput = this.validateRequest(req.body);
            const authOutput: AuthenticateUserOutput = await this.useCase.execute(input);
            return res.status(201).json({ message: "User authenticated successfully.", data: authOutput });
        }
        catch(e: unknown) {
            return ControllerHandler.handleResponseError(res, e as ApplicationError);
        }
    }

    protected validateRequest(data: AuthenticateUserInput): AuthenticateUserInput {
        const schema: ZodType<AuthenticateUserInput> = z.object({
            email: z.string().email(),
            password: z.string().nonempty()
        }).strict();

        return ZodSchemaValidator.validateDataWithSchema({ data, schema });
    }   
}