import { inject, injectable } from "tsyringe";
import ControllerHandler from "@/common/adapters/helpers/ControllerHandler";
import type ExpressController from "@/common/adapters/controllers/ExpressController";
import type DeleteProductByIdUseCase from "@/products/application/usecases/deleteProductById/DeleteProductByIdUseCase";
import type DeleteProductByIdInput from "@/products/application/dto/DeleteProductByIdInput";
import type { ProductOutput } from "@/products/application/dto/productIo";
import z from "zod";
import ZodSchemaValidator from "@/common/adapters/helpers/ZodSchemaValidator";
import type { Request, Response } from "express";
import ApplicationError from "@/common/domain/errors/ApplicationError";

@injectable()
export default class DeleteProductByIdController implements ExpressController {
    constructor (
        @inject("DeleteProductByIdUseCase") 
        private readonly useCase: DeleteProductByIdUseCase
    ) {}

    public handle = async (req: Request, res: Response): Promise<Response> => {
        try {
            const input: DeleteProductByIdInput = this.validateRequest(req.params.id);
            const product: ProductOutput = await this.useCase.execute(input);
            return res.status(200).json({ message: "Product deleted.", data: product });
        }
        catch(e: unknown) {
            return ControllerHandler.handleResponseError(res, e as ApplicationError);
        }
    }

    protected validateRequest(data: DeleteProductByIdInput): DeleteProductByIdInput {
        const idSchema = z.string().uuid();

        return ZodSchemaValidator.validateDataWithSchema({ data, schema: idSchema });
    }   
}