import { inject, injectable } from "tsyringe";
import ControllerHandler from "@/common/adapters/helpers/ControllerHandler";
import type ExpressController from "@/common/adapters/controllers/ExpressController";
import type SearchUserUseCase from "@/users/application/usecases/searchUser/SearchUserUseCase";
import type SearchUserRequest from "@/users/adapters/dto/SearchUserRequest";
import type { SearchUserInput, SearchUserOutput } from "@/users/application/dto/searchUserIo";
import z, { ZodType } from "zod";
import ZodSchemaValidator from "@/common/adapters/helpers/ZodSchemaValidator";
import type { Request, Response } from "express";
import ApplicationError from "@/common/domain/errors/ApplicationError";
import DtoUtilities from "@/common/domain/utils/DtoUtilities";

@injectable()
export default class SearchUserController implements ExpressController {
    constructor (
        @inject("SearchUserUseCase") 
        private readonly useCase: SearchUserUseCase
    ) {}

    public handle = async (req: Request, res: Response): Promise<Response> => {
        try {
            const query: SearchUserRequest = this.validateRequest(req.query);
            
            const input: SearchUserInput = this.mapToUseCase(query);
            const searchResult: SearchUserOutput = await this.useCase.execute(input);

            return res.status(200).json({ message: "Successful search.", data: searchResult });
        }
        catch(e: unknown) {
            return ControllerHandler.handleResponseError(res, e as ApplicationError);
        }
    }

    protected validateRequest(data: SearchUserRequest): SearchUserRequest {
        const schema: ZodType<SearchUserRequest> = z.object({
            pagenumber: z.coerce.number().optional(),
            itemsperpage: z.coerce.number().optional(),
            sortfield: z.string().optional(),
            sortdirection: z.string().optional(),
            filterfield: z.string().optional(),
            filtervalue: z.string().optional()
        }).strict();

        return ZodSchemaValidator.validateDataWithSchema({ data, schema });
    }
    
    private mapToUseCase(request: SearchUserRequest): SearchUserInput {
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
    }
}