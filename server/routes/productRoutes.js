const express = require('express');
const productController = require('../controllers/productController');
// Assuming authentication middleware might be added later for protected routes
// const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management and catalog browsing
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve a list of products with search, filter, and pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for product names or descriptions
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter products by category
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price for filtering
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price for filtering
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of products per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, name_asc, name_desc, createdAt_asc, createdAt_desc]
 *         description: Sort order for products
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalProducts:
 *                   type: integer
 *       500:
 *         description: Server error
 */
router.get('/', productController.getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Retrieve a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       200:
 *         description: A single product.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get('/:id', productController.getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Product created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (e.g., not an admin)
 *       500:
 *         description: Server error
 */
// Example of adding an auth middleware for admin-only routes
// router.post('/', authMiddleware.verifyToken, authMiddleware.authorizeRoles(['admin']), productController.createProduct);
router.post('/', productController.createProduct); // For now, no auth middleware applied

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update an existing product by ID (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (e.g., not an admin)
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
// router.put('/:id', authMiddleware.verifyToken, authMiddleware.authorizeRoles(['admin']), productController.updateProduct);
router.put('/:id', productController.updateProduct); // For now, no auth middleware applied

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       204:
 *         description: Product deleted successfully.
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (e.g., not an admin)
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
// router.delete('/:id', authMiddleware.verifyToken, authMiddleware.authorizeRoles(['admin']), productController.deleteProduct);
router.delete('/:id', productController.deleteProduct); // For now, no auth middleware applied

module.exports = router;