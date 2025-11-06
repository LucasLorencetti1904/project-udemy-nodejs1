import { inject, injectable } from "tsyringe";
import z from "zod";
import Controller from "@/common/infrastructure/http/controllers/Controller";
import ApplicationError from "@/common/domain/errors/ApplicationError";
import type { ZodType } from "zod";
import type { Request, Response } from "express";
import type CreateUserUseCase from "@/users/application/usecases/createUser/CreateUserUseCase";
import type { UserOutput } from "@/users/application/dto/userIo";
import type CreateUserInput from "@/users/application/dto/CreateUserInput";

@injectable()
export default class CreateUserController extends Controller {
    constructor (
        @inject("CreateUserUseCase") 
        private readonly useCase: CreateUserUseCase
    ) { super () }

    public handle = async (req: Request, res: Response): Promise<Response> => {
        try {
            const input = this.handleRequest(req.body);
            const user: UserOutput = await this.useCase.execute(input);
            return res.status(201).json({ message: "User registered successfully.", data: user });
        }
        catch(e: unknown) {
            return this.handleResponseErr(res, e as ApplicationError);
        }
    }

    protected handleRequest(data: unknown): any {
        const schema: ZodType<CreateUserInput> = z.object({
            name: z.string().nonempty(),
            email: z.string().nonempty(),
            password: z.string().nonempty()
        }).strict();

        const result = schema.safeParse(data);

        if (result.success) {
            return result.data;
        }

        this.ThrowZodError(result.error);
    }   
}