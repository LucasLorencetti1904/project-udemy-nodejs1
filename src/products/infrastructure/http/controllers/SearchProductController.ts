import { inject, injectable } from "tsyringe";
import Controller from "@/common/infrastructure/http/controllers/Controller";
import ApplicationError from "@/common/domain/errors/ApplicationError";
import type { Request, Response } from "express";
import type ProductOutput from "@/products/application/usecases/default/ProductOutput";
import { SearchProductInput, SearchProductOutput } from "@/products/application/usecases/searchProduct/SearchProdutIo";
import z, { ZodType } from "zod";
import SearchProductUseCase from "@/products/application/usecases/searchProduct/SeachProductUseCase";

@injectable()
export default class SearchProductController extends Controller {
    constructor (
        @inject("SearchProductUseCase") 
        private readonly useCase: SearchProductUseCase
    ) { super () }

    public handle = async (req: Request, res: Response): Promise<Response> => {
        try {
            this.validate(req.body);
            const searchResult: SearchProductOutput = await this.useCase.execute(req.body);
            return res.status(200).json({ message: "Successful search.", data: searchResult });
        }
        catch(e: unknown) {
            return this.handleResponseErr(res, e as ApplicationError);
        }
    }

    protected validate(data: unknown): void {
        const schema = z.object({
            page: z.number().optional(),
            perPage: z.number().optional(),
            sort: z.string().optional(),
            sortDir: z.string().optional(),
            filter: z.string().optional()
        }).strict();

        const result = schema.safeParse(data);

        this.handleZodResult(result);
    }  
}