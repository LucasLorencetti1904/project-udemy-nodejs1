import { inject, injectable } from "tsyringe";
import Controller from "@/common/adapters/controllers/Controller";
import type CreateUserUseCase from "@/users/application/usecases/createUser/CreateUserUseCase";
import type CreateUserInput from "@/users/application/dto/CreateUserInput";
import type { UserOutput } from "@/users/application/dto/userIo";
import z from "zod";
import type { ZodType } from "zod";
import ZodSchemaValidator from "@/common/adapters/helpers/ZodSchemaValidator";
import type { Request, Response } from "express";
import ApplicationError from "@/common/domain/errors/ApplicationError";

@injectable()
export default class CreateUserController extends Controller {
    constructor (
        @inject("CreateUserUseCase") 
        private readonly useCase: CreateUserUseCase
    ) { super (); }

    public handle = async (req: Request, res: Response): Promise<Response> => {
        try {
            const input: CreateUserInput = this.validateRequest(req.body);
            const user: UserOutput = await this.useCase.execute(input);
            return res.status(201).json({ message: "User registered successfully.", data: user });
        }
        catch(e: unknown) {
            return this.handleResponseErr(res, e as ApplicationError);
        }
    }

    protected validateRequest(data: unknown): CreateUserInput {
        const schema: ZodType<CreateUserInput> = z.object({
            name: z.string().nonempty(),
            email: z.string().email(),
            password: z.string().nonempty()
        }).strict();

        return ZodSchemaValidator.handleDataWithSchema({ data, schema });
    }   
}