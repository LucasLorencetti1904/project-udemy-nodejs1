import { inject, injectable } from "tsyringe";
import z from "zod";
import Controller from "@/common/infrastructure/http/controllers/Controller";
import ApplicationError from "@/common/domain/errors/ApplicationError";
import type { Request, Response } from "express";
import type ProductOutput from "@/products/application/usecases/default/ProductOutput";
import type DeleteProductByIdUseCase from "@/products/application/usecases/deleteProductById/DeleteProductByIdUseCase";

@injectable()
export default class DeleteProductByIdController extends Controller {
    constructor (
        @inject("DeleteProductByIdUseCase") 
        private readonly useCase: DeleteProductByIdUseCase
    ) { super () }

    public handle = async (req: Request, res: Response): Promise<Response> => {
        try {
            this.validate(req.params.id);
            const product: ProductOutput = await this.useCase.execute(req.params.id);
            return res.status(200).json({ message: "Product deleted.", data: product });
        }
        catch(e: unknown) {
            return this.handleResponseErr(res, e as ApplicationError);
        }
    }

    protected validate(data: unknown): void {
        const idSchema = z.string().uuid();

        const result = idSchema.safeParse(data);

        this.handleZodResult(result);
    }   
}