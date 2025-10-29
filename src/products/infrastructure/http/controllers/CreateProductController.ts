import { inject, injectable } from "tsyringe";
import type { Request, Response } from "express";
import z from "zod";
import ApplicationError from "@/common/domain/errors/ApplicationError";
import type { ZodType } from "zod";
import type CreateProductUseCase from "@/products/application/usecases/createProduct/CreateProductUseCase";
import type CreateProductInput from "@/products/application/usecases/createProduct/CreateProductIoDto";
import type ProductOutput from "@/products/application/ProductOutput";
import type Controller from "@/common/infrastructure/http/controllers/Controller";

@injectable()
export default class CreateProductController implements Controller {
    constructor (
        @inject("CreateProductUseCase") 
        private readonly useCase: CreateProductUseCase
    ) {}

    public handle = async (req: Request, res: Response): Promise<Response> => {
        try {
            this.validate(req.body);
            const product: ProductOutput = await this.useCase.execute(req.body);
            return res.status(201).json({ data: product });
        }
        catch(e: unknown) {
            throw e;
        }
    }

    private validate(data: unknown): void {
        const schema: ZodType<CreateProductInput> = z.object({
            name: z.string(),
            price: z.number(),
            quantity: z.number()
        });

        const result = schema.safeParse(data);

        if (!result.success) {
            throw new ApplicationError(`${result.error.issues.map((err) => {
                return `${err.path.join(".")} -> ${err.message}`;
            }).join(`, `)}`);
        }
    }   
}