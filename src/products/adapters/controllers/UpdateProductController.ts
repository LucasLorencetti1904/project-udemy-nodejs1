import { inject, injectable } from "tsyringe";
import ControllerHandler from "@/common/adapters/helpers/ControllerHandler";
import type ExpressController from "@/common/adapters/controllers/ExpressController";
import UpdateProductUseCase from "@/products/application/usecases/updateProduct/UpdateProductUseCase";
import type UpdateProductInput from "@/products/application/dto/UpdateProductInput";
import type { ProductOutput } from "@/products/application/dto/productIo";
import z from "zod";
import type { ZodType } from "zod";
import ZodSchemaValidator from "@/common/adapters/helpers/ZodSchemaValidator";
import type { Request, Response } from "express";
import ApplicationError from "@/common/domain/errors/ApplicationError";

@injectable()
export default class UpdateProductController implements ExpressController {
    constructor (
        @inject("UpdateProductUseCase") 
        private readonly useCase: UpdateProductUseCase
    ) {}

    public handle = async (req: Request, res: Response): Promise<Response> => {
        try {
            const rawData: UpdateProductInput = { id: req.params.id, ...req.body };
            const input: UpdateProductInput = this.validateRequest(rawData);
            const updatedProduct: ProductOutput = await this.useCase.execute(input);
            return res.status(200).json({ message: "Product updated successfully.", data: updatedProduct });
        }
        catch(e: unknown) {
            return ControllerHandler.handleResponseError(res, e as ApplicationError);
        }
    }

    protected validateRequest(data: UpdateProductInput): UpdateProductInput {
        const schema: ZodType<UpdateProductInput> = z.object({
            id: z.string().uuid(),
            name: z.string().optional(),
            price: z.number().gt(0).optional(),
            quantity: z.number().int().gt(0).optional()
        }).strict();

        return ZodSchemaValidator.validateDataWithSchema({ data, schema });
    }   
}