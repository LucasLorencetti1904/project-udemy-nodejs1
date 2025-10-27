import { Request, Response } from "express";

export default interface ProductController {
    handle(req: Request, res: Response): Promise<Response>;
}