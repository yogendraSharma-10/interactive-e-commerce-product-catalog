const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
// const authRoutes = require('./routes/authRoutes'); // Placeholder for future user authentication routes

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Connect to the database
connectDB();

// --- Middleware ---

// Enable CORS for cross-origin requests
// Configure CORS to allow requests from the client URL specified in .env
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // Default to localhost:3000 if not specified
    credentials: true, // Allow sending cookies/authorization headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON request bodies
app.use(express.json());

// Set security-related HTTP headers
app.use(helmet());

// HTTP request logger middleware
// 'dev' format provides concise output colored by response status for development use
app.use(morgan('dev'));

// --- Routes ---

// Basic health check / welcome route
app.get('/', (req, res) => {
    res.send('E-commerce Product Catalog API is running...');
});

// Product routes
// All routes defined in productRoutes will be prefixed with '/api/products'
app.use('/api/products', productRoutes);

// Placeholder for authentication routes (e.g., /api/auth/register, /api/auth/login)
// app.use('/api/auth', authRoutes);

// --- Cross-Project Context / Microservice Integration Examples ---
// In a real microservice architecture, this service might interact with others.
// Below are conceptual examples of how this E-commerce service might leverage
// the Custom URL Shortener and AI-Powered Content Assistant services.

// Example: Endpoint to get a shortened URL for a product (e.g., for sharing)
// This would typically involve making an HTTP request to the URL Shortener service.
app.post('/api/products/:id/shorten-url', async (req, res) => {
    const productId = req.params.id;
    const longUrl = `${process.env.CLIENT_URL}/products/${productId}`; // Assuming a client-side product detail page
    const shortenerServiceUrl = process.env.SHORTENER_SERVICE_URL;

    if (!shortenerServiceUrl) {
        return res.status(503).json({ message: 'URL Shortener service URL not configured.' });
    }

    try {
        // In a real scenario, you'd use a library like 'axios' to make an HTTP POST request:
        // const response = await axios.post(`${shortenerServiceUrl}/shorten`, { longUrl });
        // const shortUrl = response.data.shortUrl;
        // res.status(200).json({ productId, longUrl, shortUrl });

        // For now, we'll simulate the response
        console.log(`Attempting to shorten URL for product ${productId} via ${shortenerServiceUrl}`);
        res.status(200).json({
            message: `Request to shorten URL for product ${productId} (${longUrl}) sent to URL Shortener service.`,
            simulatedShortUrl: `http://short.ly/${Math.random().toString(36).substring(2, 8)}`
        });
    } catch (error) {
        console.error('Error calling URL Shortener service:', error.message);
        res.status(500).json({ message: 'Failed to shorten URL due to external service error.' });
    }
});

// Example: Endpoint to enhance a product description using the AI-Powered Content Assistant
// This would involve sending product data to the AI service for processing.
app.post('/api/products/:id/enhance-description', async (req, res) => {
    const productId = req.params.id;
    const { description } = req.body; // Assuming the current description is sent in the body
    const aiAssistantServiceUrl = process.env.AI_ASSISTANT_SERVICE_URL;

    if (!aiAssistantServiceUrl) {
        return res.status(503).json({ message: 'AI Assistant service URL not configured.' });
    }

    if (!description) {
        return res.status(400).json({ message: 'Description is required for enhancement.' });
    }

    try {
        // In a real scenario, you'd use 'axios' to make an HTTP POST request:
        // const response = await axios.post(`${aiAssistantServiceUrl}/enhance-text`, { text: description });
        // const enhancedDescription = response.data.enhancedText;
        // // You would then update the product in your database with the enhanced description
        // // await Product.findByIdAndUpdate(productId, { description: enhancedDescription });
        // res.status(200).json({ productId, originalDescription: description, enhancedDescription });

        // For now, we'll simulate the response
        console.log(`Attempting to enhance description for product ${productId} via ${aiAssistantServiceUrl}`);
        res.status(200).json({
            message: `Request to enhance description for product ${productId} sent to AI Assistant service.`,
            originalDescription: description,
            simulatedEnhancedDescription: `[AI Enhanced] ${description} - This product is truly exceptional and a must-have!`
        });
    } catch (error) {
        console.error('Error calling AI Assistant service:', error.message);
        res.status(500).json({ message: 'Failed to enhance description due to external service error.' });
    }
});


// --- Error Handling Middleware ---

// Catch-all for undefined routes (404 Not Found)
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); // Pass the error to the next error handling middleware
});

// General error handling middleware
app.use((err, req, res, next) => {
    // Determine the status code; if it's 200 (OK), it means an error occurred but wasn't explicitly set
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        // In production, don't leak stack traces for security reasons
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
});

// --- Start Server ---

const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`Client URL: ${process.env.CLIENT_URL}`);

    // Log configured URLs for other services if they exist
    if (process.env.SHORTENER_SERVICE_URL) {
        console.log(`URL Shortener Service configured at: ${process.env.SHORTENER_SERVICE_URL}`);
    }
    if (process.env.AI_ASSISTANT_SERVICE_URL) {
        console.log(`AI Assistant Service configured at: ${process.env.AI_ASSISTANT_SERVICE_URL}`);
    }
});