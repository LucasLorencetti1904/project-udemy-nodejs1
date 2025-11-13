import { inject, injectable } from "tsyringe";
import Controller from "@/common/adapters/controllers/Controller";
import type AuthenticateUserUseCase from "@/users/application/usecases/authenticateUser/AuthenticateUserUseCase";
import type { AuthenticateUserInput, AuthenticateUserOutput } from "@/users/application/dto/authenticateUserIo";
import z from "zod";
import type { ZodType } from "zod";
import ZodSchemaValidator from "@/common/adapters/helpers/ZodSchemaValidator";
import type { Request, Response } from "express";
import ApplicationError from "@/common/domain/errors/ApplicationError";

@injectable()
export default class AuthenticateUserController extends Controller {
    constructor (
        @inject("AuthenticateUserUseCase") 
        private readonly useCase: AuthenticateUserUseCase
    ) { super (); }

    public handle = async (req: Request, res: Response): Promise<Response> => {
        try {
            const input: AuthenticateUserInput = this.validateRequest(req.body);
            const authOutput: AuthenticateUserOutput = await this.useCase.execute(input);
            return res.status(201).json({ message: "User authenticated successfully.", data: authOutput });
        }
        catch(e: unknown) {
            return this.handleResponseErr(res, e as ApplicationError);
        }
    }

    protected validateRequest(data: unknown): AuthenticateUserInput {
        const schema: ZodType<AuthenticateUserInput> = z.object({
            email: z.string().email(),
            password: z.string().nonempty()
        }).strict();

        return ZodSchemaValidator.handleDataWithSchema({ data, schema });
    }   
}