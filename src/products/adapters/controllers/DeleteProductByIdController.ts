import { inject, injectable } from "tsyringe";
import Controller from "@/common/adapters/controllers/Controller";
import type DeleteProductByIdUseCase from "@/products/application/usecases/deleteProductById/DeleteProductByIdUseCase";
import type DeleteProductByIdInput from "@/products/application/dto/DeleteProductByIdInput";
import type { ProductOutput } from "@/products/application/dto/productIo";
import z from "zod";
import ZodSchemaValidator from "@/common/adapters/helpers/ZodSchemaValidator";
import type { Request, Response } from "express";
import ApplicationError from "@/common/domain/errors/ApplicationError";

@injectable()
export default class DeleteProductByIdController extends Controller {
    constructor (
        @inject("DeleteProductByIdUseCase") 
        private readonly useCase: DeleteProductByIdUseCase
    ) { super (); }

    public handle = async (req: Request, res: Response): Promise<Response> => {
        try {
            const input: DeleteProductByIdInput = this.validateRequest(req.params.id);
            const product: ProductOutput = await this.useCase.execute(input);
            return res.status(200).json({ message: "Product deleted.", data: product });
        }
        catch(e: unknown) {
            return this.handleResponseErr(res, e as ApplicationError);
        }
    }

    protected validateRequest(data: DeleteProductByIdInput): DeleteProductByIdInput {
        const idSchema = z.string().uuid();

        return ZodSchemaValidator.validateDataWithSchema({ data, schema: idSchema });
    }   
}