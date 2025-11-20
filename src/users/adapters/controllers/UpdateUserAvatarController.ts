import { inject, injectable } from "tsyringe";
import Controller from "@/common/adapters/controllers/Controller";
import type UpdateUserAvatarUseCase from "@/users/application/usecases/updateUserAvatar/UpdateUserAvatarUseCase";
import type UpdateUserAvatarInput from "@/users/application/dto/UpdateUserAvatarInput";
import type { UserOutput } from "@/users/application/dto/userIo";
import z from "zod";
import type { ZodType } from "zod";
import ZodSchemaValidator from "@/common/adapters/helpers/ZodSchemaValidator";
import type { Request, Response } from "express";
import ApplicationError from "@/common/domain/errors/ApplicationError";
import UserAvatarImageFile from "@/users/application/dto/UserAvatarImageFile";

@injectable()
export default class UpdateUserAvatarController extends Controller {
    constructor (
        @inject("UpdateUserAvatarUseCase") 
        private readonly useCase: UpdateUserAvatarUseCase
    ) { super (); }

    public handle = async (req: Request, res: Response): Promise<Response> => {
        try {
            const fileInput: UserAvatarImageFile = this.handleFileToInput(req.file);

            const input: UpdateUserAvatarInput = this.validateRequest({ id: req.params.id, avatarImage: fileInput });
            const user: UserOutput = await this.useCase.execute(input);
            
            return res.status(200).json({ message: "User avatar updated successfully.", data: user });
        }
        catch(e: unknown) {
            return this.handleResponseErr(res, e as ApplicationError);
        }
    }

    protected validateRequest(data: UpdateUserAvatarInput): UpdateUserAvatarInput {
        const fileSchema: ZodType<UserAvatarImageFile> = z.object({
            name: z.string().nonempty(),
            type: z.string().nonempty(),
            size: z.number().nonnegative(),
            content: z.instanceof(Buffer)
        });

        const schema: ZodType<UpdateUserAvatarInput> = z.object({
            id: z.string().uuid(),
            avatarImage: fileSchema
        }).strict();

        return ZodSchemaValidator.validateDataWithSchema({ data, schema });
    }

    private handleFileToInput(file: Express.Multer.File): UserAvatarImageFile {
        return {
            name: file.originalname.split(" ").join("-"),
            type: file.mimetype,
            size: file.size,
            content: file.buffer
        }
    }
}