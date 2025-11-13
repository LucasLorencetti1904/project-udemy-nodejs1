import { injectable } from "tsyringe";
import { type RequestHandler } from "express";
import multer, { memoryStorage } from "multer";
import { BadRequestError } from "@/common/domain/errors/httpErrors";

@injectable()
export default class MulterAvatarUploadMiddleware {
    public handle(): RequestHandler {
        return multer({
            storage: memoryStorage(),
            limits: {
                fieldSize: 1024 * 1024 * 3
            },
            fileFilter: (_req, file, callback) => {
                const allowedTypes: string[] = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

                if (!allowedTypes.includes(file.mimetype)) {
                    callback(new BadRequestError("Invalid file type. Only JPEG, JPG, PNG and WEBP are allowed."));
                }

                callback(null, true);
            }
        }).single("avatar");
    };
}