import ApplicationError from "@/common/domain/errors/ApplicationErrors";
import { CreateProductInput, CreateProductOutput } from "@/products/application/dto/CreateProductIoDto";
import CreateProductUseCase from "@/products/application/usecases/abstract/CreateProductUseCase";
import ProductController from "@/products/infrastructure/http/controllers/ProductController";
import { Request, Response } from "express";
import z, { ZodType } from "zod";

export default class CreateProductController implements ProductController {
    constructor(private readonly useCase: CreateProductUseCase) {}

    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            this.validate(req.body);
            const product: CreateProductOutput = await this.useCase.execute(req.body);
            return res.status(201).json({ data: product });
        }
        catch(e: unknown) {
            throw e;
        }
    }

    protected validate(data: unknown): void {
        const schema: ZodType<CreateProductInput> = z.object({
            name: z.string(),
            price: z.number(),
            quantity: z.number()
        });

        const result = schema.safeParse(data);

        if (!result.success) {
            throw new ApplicationError(`${result.error.issues.map((err) => {
                return `${err.path.join(".")} -> ${err.message}`;}).join(`, `)}`);
        }
    }
}