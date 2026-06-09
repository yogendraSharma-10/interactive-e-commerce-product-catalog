const Product = require('../models/Product');
const mongoose = require('mongoose');

/**
 * @desc    Get all products with search, filter, sort, and pagination
 * @route   GET /api/products
 * @access  Public
 */
exports.getAllProducts = async (req, res) => {
    try {
        const {
            q, // Search query
            category,
            minPrice,
            maxPrice,
            sortBy = 'createdAt', // Default sort by creation date
            sortOrder = 'desc', // Default sort order descending
            page = 1,
            limit = 10
        } = req.query;

        let filter = {};
        let sort = {};

        // Search functionality
        if (q) {
            filter.$or = [{
                name: {
                    $regex: q,
                    $options: 'i'
                }
            }, {
                description: {
                    $regex: q,
                    $options: 'i'
                }
            }, ];
        }

        // Category filter
        if (category) {
            filter.category = {
                $regex: category,
                $options: 'i'
            };
        }

        // Price range filter
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) {
                filter.price.$gte = parseFloat(minPrice);
            }
            if (maxPrice) {
                filter.price.$lte = parseFloat(maxPrice);
            }
        }

        // Sorting
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute queries
        const products = await Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const totalProducts = await Product.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: products.length,
            total: totalProducts,
            page: parseInt(page),
            pages: Math.ceil(totalProducts / parseInt(limit)),
            data: products,
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            error: 'Server Error: Could not retrieve products.'
        });
    }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
exports.getProductById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid product ID format.'
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error(`Error fetching product with ID ${req.params.id}:`, error);
        res.status(500).json({
            success: false,
            error: 'Server Error: Could not retrieve product.'
        });
    }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private (e.g., Admin)
 */
exports.createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            imageUrl,
            stock
        } = req.body;

        // Basic validation
        if (!name || !description || !price || !category || !imageUrl || stock === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Please provide all required product fields: name, description, price, category, imageUrl, and stock.'
            });
        }

        const newProduct = await Product.create({
            name,
            description,
            price,
            category,
            imageUrl,
            stock
        });

        res.status(201).json({
            success: true,
            data: newProduct
        });
    } catch (error) {
        console.error('Error creating product:', error);
        // Handle Mongoose validation errors specifically
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                error: messages.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error: Could not create product.'
        });
    }
};

/**
 * @desc    Update a product by ID
 * @route   PUT /api/products/:id
 * @access  Private (e.g., Admin)
 */
exports.updateProduct = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid product ID format.'
            });
        }

        const {
            name,
            description,
            price,
            category,
            imageUrl,
            stock
        } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, {
                name,
                description,
                price,
                category,
                imageUrl,
                stock
            }, {
                new: true, // Return the updated document
                runValidators: true // Run Mongoose validators on update
            }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                error: 'Product not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: updatedProduct
        });
    } catch (error) {
        console.error(`Error updating product with ID ${req.params.id}:`, error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                error: messages.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error: Could not update product.'
        });
    }
};

/**
 * @desc    Delete a product by ID
 * @route   DELETE /api/products/:id
 * @access  Private (e.g., Admin)
 */
exports.deleteProduct = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid product ID format.'
            });
        }

        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                error: 'Product not found.'
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        }); // Return empty data or the deleted product
    } catch (error) {
        console.error(`Error deleting product with ID ${req.params.id}:`, error);
        res.status(500).json({
            success: false,
            error: 'Server Error: Could not delete product.'
        });
    }
};

// Note on cross-project context:
// While this controller focuses on core product management, in a microservice
// architecture, operations here might trigger events or interact with other services.
// For example:
// - When a product is created/updated, an event could be published to a message queue
//   which an 'AI-Powered Content Assistant' service might consume to update its
//   recommendation models or generate new product descriptions.
// - When a product is deleted, related data in other services (e.g., wishlists,
//   shortened URLs for product pages from 'Custom URL Shortener') might need to be
//   cleaned up or marked as invalid.
// These interactions would typically be handled by a service layer, event bus,
// or directly within the controller if the interaction is simple and synchronous.
// For this specific file, the direct code impact is minimal, but it's a crucial
// consideration for the overall system design.