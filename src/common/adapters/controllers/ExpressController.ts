import type { Request, Response } from "express";

export default interface ExpressController {
    handle(req: Request, res: Response): Promise<Response>;
}