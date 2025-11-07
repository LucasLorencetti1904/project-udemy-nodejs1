import { inject, injectable } from "tsyringe";
import Controller from "@/common/infrastructure/http/controllers/Controller";
import ApplicationError from "@/common/domain/errors/ApplicationError";
import type { Request, Response } from "express";
import type { SearchUserInput, SearchUserOutput } from "@/users/application/dto/searchUserIo";
import z from "zod";
import type SearchUserUseCase from "@/users/application/usecases/searchUser/SearchUserUseCase";
import ZodSchemaValidator from "@/common/infrastructure/http/helpers/ZodSchemaValidator";

@injectable()
export default class SearchUserController extends Controller {
    constructor (
        @inject("SearchUserUseCase") 
        private readonly useCase: SearchUserUseCase
    ) { super () }

    public handle = async (req: Request, res: Response): Promise<Response> => {
        try {
            const input: SearchUserInput = this.validateRequest(req.query);
            const searchResult: SearchUserOutput = await this.useCase.execute(input);
            return res.status(200).json({ message: "Successful search.", data: searchResult });
        }
        catch(e: unknown) {
            return this.handleResponseErr(res, e as ApplicationError);
        }
    }

    protected validateRequest(data: unknown): SearchUserInput {
        const schema = z.object({
            page: z.coerce.number().optional(),
            perPage: z.coerce.number().optional(),
            sort: z.string().optional(),
            sortDir: z.string().optional(),
            filter: z.string().optional()
        }).strict();

        return ZodSchemaValidator.handleDataWithSchema({ data, schema });
    }  
}