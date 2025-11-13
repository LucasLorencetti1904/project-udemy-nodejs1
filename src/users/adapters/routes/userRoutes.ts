import { container } from "tsyringe";
import { Router } from "express";
import CreateUserController from "@/users/adapters/controllers/CreateUserController";
import SearchUserController from "@/users/adapters/controllers/SearchUserController";
import UpdateUserAvatarController from "@/users/adapters/controllers/UpdateUserAvatarController";
import AuthorizationMiddleware from "@/users/adapters/middlewares/AuthorizationMiddleware";
import MulterAvatarUploadMiddleware from "@/users/adapters/middlewares/MulterAvatarUploadMiddleware";

const userRouter: Router = Router();

const authorizationMiddleware: AuthorizationMiddleware = container.resolve(AuthorizationMiddleware);
const multerAvatarUploadMiddleware: MulterAvatarUploadMiddleware = container.resolve(MulterAvatarUploadMiddleware);

const createUserController: CreateUserController = container.resolve(CreateUserController);
const searchUserController: SearchUserController = container.resolve(SearchUserController);
const updateUserAvatar: UpdateUserAvatarController = container.resolve(UpdateUserAvatarController);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - passowrd
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id (uuid) of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         passowrd:
 *           type: string
 *           description: The passowrd of the user
 *         avatar:
 *           type: string
 *           description: The avatar of the user
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the user was added
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date the user was last updated
 *       example:
 *         id: 06db518e-613b-4a76-8e4f-2e305fe4f68d
 *         name: Sample User
 *         email: sampleuser@mail.com
 *         password: $2a$06$tPOF8dcfc5sIvII3NTLQh.QF5sR4iBbgAihVn.l2M07WoDyD7b1Ge
 *         avatar: null
 *         created_at: 2023-01-01T10:00:00Z
 *         updated_at: 2023-01-01T10:00:00Z
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Input data not provided or invalid
 *       409:
 *         description: Email already used on another user
 */
userRouter.post("/", createUserController.handle);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns a paginated list of users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve
 *       - in: query
 *         name: per_page
 *         schema:
 *           type: integer
 *           default: 15
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: null
 *         description: Field to sort by
 *       - in: query
 *         name: sort_dir
 *         schema:
 *           type: string
 *           default: null
 *         description: Sort direction (asc or desc)
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           default: null
 *         description: Filter string to search for specific users
 *     responses:
 *       200:
 *         description: A paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserListResponse'
 */
userRouter.get("/", authorizationMiddleware.handle, searchUserController.handle);

/**
 * @swagger
 * /users/{id}/avatar:
 *   patch:
 *     summary: Upload an image for a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the user whose avatar will be updated
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *     responses:
 *       200:
 *         description: The image was successfully uploaded
 *       400:
 *         description: Bad request (invalid file type or data)
 *       404:
 *         description: The user was not found
 *       500:
 *         description: Internal server error
 */
userRouter.patch("/:id/avatar", authorizationMiddleware.handle, multerAvatarUploadMiddleware.handle, updateUserAvatar.handle );

export default userRouter;