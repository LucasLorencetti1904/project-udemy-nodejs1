import { inject, injectable } from "tsyringe";
import Controller from "@/common/infrastructure/http/controllers/Controller";
import ApplicationError from "@/common/domain/errors/ApplicationError";
import type { Request, Response } from "express";
import { SearchProductOutput } from "@/products/application/dto/searchProdutIo";
import z from "zod";
import SearchProductUseCase from "@/products/application/usecases/searchProduct/SeachProductUseCase";

@injectable()
export default class SearchProductController extends Controller {
    constructor (
        @inject("SearchProductUseCase") 
        private readonly useCase: SearchProductUseCase
    ) { super () }

    public handle = async (req: Request, res: Response): Promise<Response> => {
        try {
            const input = this.handleRequest(req.query);
            const searchResult: SearchProductOutput = await this.useCase.execute(input);
            return res.status(200).json({ message: "Successful search.", data: searchResult });
        }
        catch(e: unknown) {
            return this.handleResponseErr(res, e as ApplicationError);
        }
    }

    protected handleRequest(data: unknown): any {
        const schema = z.object({
            page: z.coerce.number().optional(),
            perPage: z.coerce.number().optional(),
            sort: z.string().optional(),
            sortDir: z.string().optional(),
            filter: z.string().optional()
        }).strict();

        const result = schema.safeParse(data);

        if (result.success) {
            return result.data;
        }

        this.ThrowZodError(result.error);
    }  
}