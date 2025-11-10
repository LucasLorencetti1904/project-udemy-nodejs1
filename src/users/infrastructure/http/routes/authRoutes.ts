import { container } from "tsyringe";
import { Router } from "express";
import AuthenticateUserController from "@/users/infrastructure/http/controllers/AuthenticateUserController";

const authRouter: Router = Router();

const authenticateUserController: AuthenticateUserController = container.resolve(AuthenticateUserController);

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthResponse:
 *       type: object
 *       properties:
 *         access_token:
 *           type: string
 *           description: Access token (JWT)
 *       example:
 *         access_token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjAwMTYzOTMsImV4cCI6MTcyMDEwMjc5Mywic3ViIjoiNDhhNmVhODUtMDRmNS00NGRjLWExOTItZjQ3MDMwNzg2M2RmIn0.i2e7TQ5dSY7dhdL0kldySVOeYiLHC75OVo7P4yvBGmw
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: The authentication managing API
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthResponse'
 *     responses:
 *       200:
 *         description: The user was successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 */
authRouter.post("/login", authenticateUserController.handle);

export default authRouter;