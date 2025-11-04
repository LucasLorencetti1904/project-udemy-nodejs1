import { inject, injectable } from "tsyringe";
import z from "zod";
import Controller from "@/common/infrastructure/http/controllers/Controller";
import ApplicationError from "@/common/domain/errors/ApplicationError";
import type { Request, Response } from "express";
import type { ProductOutput } from "@/products/application/usecases/default/productIo";
import type DeleteProductByIdUseCase from "@/products/application/usecases/deleteProductById/DeleteProductByIdUseCase";

@injectable()
export default class DeleteProductByIdController extends Controller {
    constructor (
        @inject("DeleteProductByIdUseCase") 
        private readonly useCase: DeleteProductByIdUseCase
    ) { super () }

    public handle = async (req: Request, res: Response): Promise<Response> => {
        try {
            const input = this.handleRequest(req.params.id);
            const product: ProductOutput = await this.useCase.execute(input);
            return res.status(200).json({ message: "Product deleted.", data: product });
        }
        catch(e: unknown) {
            return this.handleResponseErr(res, e as ApplicationError);
        }
    }

    protected handleRequest(data: unknown): any {
        const idSchema = z.string().uuid();

        const result = idSchema.safeParse(data);

        if (result.success) {
            return result.data;
        }

        this.ThrowZodError(result.error);
    }   
}