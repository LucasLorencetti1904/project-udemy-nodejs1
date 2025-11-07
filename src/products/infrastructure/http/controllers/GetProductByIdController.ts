import { inject, injectable } from "tsyringe";
import z from "zod";
import Controller from "@/common/infrastructure/http/controllers/Controller";
import ApplicationError from "@/common/domain/errors/ApplicationError";
import GetProductByIdUseCase from "@/products/application/usecases/getProductById/GetProductByIdUseCase";
import type { Request, Response } from "express";
import type { ProductOutput } from "@/products/application/dto/productIo";
import ZodSchemaValidator from "@/common/infrastructure/http/helpers/ZodSchemaValidator";
import type GetProductByIdInput from "@/products/application/dto/GetProductByIdInput";

@injectable()
export default class GetProductByIdController extends Controller {
    constructor (
        @inject("GetProductByIdUseCase") 
        private readonly useCase: GetProductByIdUseCase
    ) { super () }

    public handle = async (req: Request, res: Response): Promise<Response> => {
        try {
            const input: GetProductByIdInput = this.validateRequest(req.params.id);
            const product: ProductOutput = await this.useCase.execute(input);
            return res.status(200).json({ message: "Product found.", data: product });
        }
        catch(e: unknown) {
            return this.handleResponseErr(res, e as ApplicationError);
        }
    }

    protected validateRequest(data: unknown): GetProductByIdInput {
        const idSchema = z.string().uuid();

        return ZodSchemaValidator.handleDataWithSchema({ data, schema: idSchema });
    }   
}