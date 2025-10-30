import { container } from "tsyringe";
import { Router } from "express";
import CreateProductController from "@/products/infrastructure/http/controllers/CreateProductController";
import GetProductByIdController from "@/products/infrastructure/http/controllers/GetProductByIdController";

const productRouter: Router = Router();

const createProductController: CreateProductController = container.resolve(CreateProductController);
const getProductByIdController: GetProductByIdController = container.resolve(GetProductByIdController);

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - quantity
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id (uuid) of the product
 *         name:
 *           type: string
 *           description: The name of the product
 *         price:
 *           type: number
 *           description: The price of the product
 *         quantity:
 *           type: number
 *           description: The quantity of the product
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the product was added
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date the product was last updated
 *       example:
 *         id: 06db518e-613b-4a76-8e4f-2e305fe4f68d
 *         name: Sample Product
 *         price: 29.99
 *         quantity: 100
 *         created_at: 2023-01-01T10:00:00Z
 *         updated_at: 2023-01-01T10:00:00Z
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: The products managing API
 */

/**
* @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: The product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Input data not provided or invalid
 *       409:
 *         description: Name already used on another product
 */
productRouter.post("/", createProductController.handle);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: The product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product was not found
 */
productRouter.get("/:id", getProductByIdController.handle);

export default productRouter;