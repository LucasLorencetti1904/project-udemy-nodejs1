import { inject, injectable } from "tsyringe";
import ControllerHandler from "@/common/adapters/helpers/ControllerHandler";
import type ExpressController from "@/common/adapters/controllers/ExpressController";
import type SearchProductUseCase from "@/products/application/usecases/searchProduct/SeachProductUseCase";
import type SearchProductRequest from "@/products/adapters/dto/SearchProductRequest";
import { SearchProductInput, SearchProductOutput } from "@/products/application/dto/searchProductIo";
import z, { ZodType } from "zod";
import ZodSchemaValidator from "@/common/adapters/helpers/ZodSchemaValidator";
import type { Request, Response } from "express";
import ApplicationError from "@/common/domain/errors/ApplicationError";
import DtoUtilities from "@/common/domain/utils/DtoUtilities";

@injectable()
export default class SearchProductController implements ExpressController {
    constructor (
        @inject("SearchProductUseCase") 
        private readonly useCase: SearchProductUseCase
    ) {}

    public handle = async (req: Request, res: Response): Promise<Response> => {
        try {
            const query: SearchProductRequest = this.validateRequest(req.query);
            
            const input: SearchProductInput = this.mapToUseCase(query);
            const searchResult: SearchProductOutput = await this.useCase.execute(input);

            return res.status(200).json({ message: "Successful search.", data: searchResult });
        }
        catch(e: unknown) {
            return ControllerHandler.handleResponseError(res, e as ApplicationError);
        }
    }

    protected validateRequest(data: SearchProductRequest): SearchProductRequest {
        const schema: ZodType<SearchProductRequest> = z.object({
            pagenumber: z.coerce.number().optional(),
            itemsperpage: z.coerce.number().optional(),
            sortfield: z.string().optional(),
            sortdirection: z.string().optional(),
            filterfield: z.string().optional(),
            filtervalue: z.string().optional()
        }).strict();

        return ZodSchemaValidator.validateDataWithSchema({ data, schema });
    }
    
    private mapToUseCase(request: SearchProductRequest): SearchProductInput {
        const pagination = {
            pageNumber: request.pagenumber,
            itemsPerPage: request.itemsperpage
        };
        const sorting = {
            field: request.sortfield,
            direction: request.sortdirection
        };
        const filter = {
            field: request.filterfield,
            value: request.filtervalue
        };

        return {
            ...(DtoUtilities.hasSomeDefinedField(pagination) && { pagination }),
            ...(DtoUtilities.hasSomeDefinedField(sorting) && { sorting }),
            ...(DtoUtilities.hasSomeDefinedField(filter) && { filter })
        }
    };
}