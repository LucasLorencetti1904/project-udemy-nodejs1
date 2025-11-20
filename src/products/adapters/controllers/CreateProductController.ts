import { inject, injectable } from "tsyringe";
import z from "zod";
import Controller from "@/common/adapters/controllers/Controller";
import type CreateProductUseCase from "@/products/application/usecases/createProduct/CreateProductUseCase";
import type CreateProductInput from "@/products/application/dto/CreateProductInput";
import type { ProductOutput } from "@/products/application/dto/productIo";
import type { Request, Response } from "express";
import type { ZodType } from "zod";
import ZodSchemaValidator from "@/common/adapters/helpers/ZodSchemaValidator";
import ApplicationError from "@/common/domain/errors/ApplicationError";

@injectable()
export default class CreateProductController extends Controller {
    constructor (
        @inject("CreateProductUseCase") 
        private readonly useCase: CreateProductUseCase
    ) { super (); }

    public handle = async (req: Request, res: Response): Promise<Response> => {
        try {
            const input: CreateProductInput = this.validateRequest(req.body);
            const product: ProductOutput = await this.useCase.execute(input);
            return res.status(201).json({ message: "Product registered successfully.", data: product });
        }
        catch(e: unknown) {
            return this.handleResponseErr(res, e as ApplicationError);
        }
    }

    protected validateRequest(data: CreateProductInput): CreateProductInput {
        const schema: ZodType<CreateProductInput> = z.object({
            name: z.string().nonempty(),
            price: z.number().gt(0),
            quantity: z.number().int().gt(0)
        }).strict();

        return ZodSchemaValidator.validateDataWithSchema({ data, schema });
    }   
}