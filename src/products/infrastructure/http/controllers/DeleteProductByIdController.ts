import { inject, injectable } from "tsyringe";
import z from "zod";
import Controller from "@/common/infrastructure/http/controllers/Controller";
import ApplicationError from "@/common/domain/errors/ApplicationError";
import type { Request, Response } from "express";
import type { ProductOutput } from "@/products/application/dto/productIo";
import type DeleteProductByIdUseCase from "@/products/application/usecases/deleteProductById/DeleteProductByIdUseCase";
import ZodSchemaValidator from "@/common/infrastructure/http/helpers/ZodSchemaValidator";
import type DeleteProductByIdInput from "@/products/application/dto/DeleteProductByIdInput";

@injectable()
export default class DeleteProductByIdController extends Controller {
    constructor (
        @inject("DeleteProductByIdUseCase") 
        private readonly useCase: DeleteProductByIdUseCase
    ) { super () }

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

    protected validateRequest(data: unknown): DeleteProductByIdInput {
        const idSchema = z.string().uuid();

        return ZodSchemaValidator.handleDataWithSchema({ data, schema: idSchema });
    }   
}