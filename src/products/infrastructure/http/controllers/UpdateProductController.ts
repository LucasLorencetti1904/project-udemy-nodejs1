import { inject, injectable } from "tsyringe";
import type { Request, Response } from "express";
import z from "zod";
import Controller from "@/common/infrastructure/http/controllers/Controller";
import ApplicationError from "@/common/domain/errors/ApplicationError";
import type { ZodType } from "zod";
import type ProductOutput from "@/products/application/usecases/default/ProductOutput";
import UpdateProductUseCase from "@/products/application/usecases/updateProduct/UpdateProductUseCase";
import type UpdateProductInput from "@/products/application/usecases/updateProduct/UpdateProductInput";

@injectable()
export default class UpdateProductController extends Controller {
    constructor (
        @inject("UpdateProductUseCase") 
        private readonly useCase: UpdateProductUseCase
    ) { super () }

    public handle = async (req: Request, res: Response): Promise<Response> => {
        try {
            const input: UpdateProductInput = { id: req.params.id, ...req.body }
            this.validate(input);
            const updatedProduct: ProductOutput = await this.useCase.execute(input);
            return res.status(200).json({ message: "Product updated successfully.", data: updatedProduct });
        }
        catch(e: unknown) {
            return this.handleResponseErr(res, e as ApplicationError);
        }
    }

    protected validate(data: unknown): void {
        const schema: ZodType<UpdateProductInput> = z.object({
            id: z.string().uuid(),
            name: z.string().optional(),
            price: z.number().gt(0).optional(),
            quantity: z.number().int().gt(0).optional()
        });

        const result = schema.safeParse(data);

        this.handleZodResult(result);
    }   
}