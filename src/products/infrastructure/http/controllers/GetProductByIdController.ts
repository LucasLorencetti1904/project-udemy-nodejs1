import { inject, injectable } from "tsyringe";
import z from "zod";
import Controller from "@/common/infrastructure/http/controllers/Controller";
import ApplicationError from "@/common/domain/errors/ApplicationError";
import GetProductByIdUseCase from "@/products/application/usecases/getProductById/GetProductByIdUseCase";
import type { Request, Response } from "express";
import type ProductOutput from "@/products/application/usecases/default/ProductOutput";

@injectable()
export default class GetProductByIdController extends Controller {
    constructor (
        @inject("GetProductByIdUseCase") 
        private readonly useCase: GetProductByIdUseCase
    ) { super () }

    public handle = async (req: Request, res: Response): Promise<Response> => {
        try {
            this.validate(req.params.id);
            const product: ProductOutput = await this.useCase.execute(req.params.id);
            return res.status(200).json({ message: "Product found.", data: product });
        }
        catch(e: unknown) {
            return this.handleResponseErr(res, e as ApplicationError);
        }
    }

    protected validate(data: unknown): void {
        const idSchema = z.string().regex (
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        { message: "Invalid UUID" }
    );;

        const result = idSchema.safeParse(data);

        this.handleZodResult(result);
    }   
}