import { inject, injectable } from "tsyringe";
import z from "zod";
import ControllerHandler from "@/common/adapters/helpers/ControllerHandler";
import type ExpressController from "@/common/adapters/controllers/ExpressController";
import type CreateProductUseCase from "@/products/application/usecases/createProduct/CreateProductUseCase";
import type CreateProductInput from "@/products/application/dto/CreateProductInput";
import type { ProductOutput } from "@/products/application/dto/productIo";
import type { Request, Response } from "express";
import type { ZodType } from "zod";
import ZodSchemaValidator from "@/common/adapters/helpers/ZodSchemaValidator";
import ApplicationError from "@/common/domain/errors/ApplicationError";

@injectable()
export default class CreateProductController implements ExpressController {
    constructor (
        @inject("CreateProductUseCase") 
        private readonly useCase: CreateProductUseCase
    ) {}

    public handle = async (req: Request, res: Response): Promise<Response> => {
        try {
            const input: CreateProductInput = this.validateRequest(req.body);
            const product: ProductOutput = await this.useCase.execute(input);
            return res.status(201).json({ message: "Product registered successfully.", data: product });
        }
        catch(e: unknown) {
            return ControllerHandler.handleResponseError(res, e as ApplicationError);
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