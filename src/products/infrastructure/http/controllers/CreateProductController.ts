import { inject, injectable } from "tsyringe";
import type { Request, Response } from "express";
import z from "zod";
import Controller from "@/common/infrastructure/http/controllers/Controller";
import ApplicationError from "@/common/domain/errors/ApplicationError";
import type { ZodType } from "zod";
import type CreateProductUseCase from "@/products/application/usecases/createProduct/CreateProductUseCase";
import type CreateProductInput from "@/products/application/usecases/createProduct/CreateProductIoDto";
import type ProductOutput from "@/products/application/ProductOutput";

@injectable()
export default class CreateProductController extends Controller {
    constructor (
        @inject("CreateProductUseCase") 
        private readonly useCase: CreateProductUseCase
    ) { super () }

    public handle = async (req: Request, res: Response): Promise<Response> => {
        try {
            this.validate(req.body);
            const product: ProductOutput = await this.useCase.execute(req.body);
            return res.status(201).json({ message: "Product registered successfully.", data: product });
        }
        catch(e: unknown) {
            return this.handleResponseErr(res, e as ApplicationError);
        }
    }

    protected validate(data: unknown): void {
        const schema: ZodType<CreateProductInput> = z.object({
            name: z.string().nonempty(),
            price: z.number().gt(0),
            quantity: z.number().int().gt(0)
        });

        const result = schema.safeParse(data);

        this.handleZodResult(result);
    }   
}