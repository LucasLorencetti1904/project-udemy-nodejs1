import { Request, Response } from "express";

export default interface Controller {
    handle(req: Request, res: Response): Promise<Response>;
}