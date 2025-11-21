import { inject, injectable } from "tsyringe";
import GetProductByIdUseCase from "@/products/application/usecases/getProductById/GetProductByIdUseCase";
import ControllerHandler from "@/common/adapters/helpers/ControllerHandler";
import type ExpressController from "@/common/adapters/controllers/ExpressController";
import type GetProductByIdInput from "@/products/application/dto/GetProductByIdInput";
import type { ProductOutput } from "@/products/application/dto/productIo";
import z from "zod";
import ZodSchemaValidator from "@/common/adapters/helpers/ZodSchemaValidator";
import type { Request, Response } from "express";
import ApplicationError from "@/common/domain/errors/ApplicationError";

@injectable()
export default class GetProductByIdController implements ExpressController {
    constructor (
        @inject("GetProductByIdUseCase") 
        private readonly useCase: GetProductByIdUseCase
    ) {}

    public handle = async (req: Request, res: Response): Promise<Response> => {
        try {
            const input: GetProductByIdInput = this.validateRequest(req.params.id);
            const product: ProductOutput = await this.useCase.execute(input);
            return res.status(200).json({ message: "Product found.", data: product });
        }
        catch(e: unknown) {
            return ControllerHandler.handleResponseError(res, e as ApplicationError);
        }
    }

    protected validateRequest(data: GetProductByIdInput): GetProductByIdInput {
        const idSchema = z.string().uuid();

        return ZodSchemaValidator.validateDataWithSchema({ data, schema: idSchema });
    }   
}