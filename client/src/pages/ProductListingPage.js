import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from '../components/ProductCard';
import axios from 'axios'; // Assuming axios is installed and used for API calls
import './ProductListingPage.css'; // Assuming a CSS file for styling the page

// Define the base URL for the API. It's good practice to use environment variables
// for API endpoints, especially in a microservice architecture.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

/**
 * ProductListingPage Component
 *
 * This component displays a list of products with advanced search, filtering,
 * sorting, and pagination capabilities. It fetches product data from a backend API.
 */
const ProductListingPage = () => {
    // State variables for managing product data and UI interactions
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [sortOrder, setSortOrder] = useState(''); // e.g., 'price_asc', 'price_desc', 'name_asc'
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0); // Total count of products matching criteria
    const [availableCategories, setAvailableCategories] = useState([]); // To populate category filter dropdown

    // useCallback hook to memoize the fetchProducts function.
    // This prevents unnecessary re-creations of the function on every render,
    // which is important when it's a dependency of useEffect.
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null); // Clear previous errors
        try {
            // Construct query parameters for the API request
            const params = {
                page: currentPage,
                limit: 12, // Number of products to display per page
                search: searchQuery,
                category: categoryFilter,
                minPrice: priceRange.min,
                maxPrice: priceRange.max,
                sort: sortOrder,
            };

            // Make the API call to fetch products
            const response = await axios.get(`${API_BASE_URL}/products`, { params });

            // Update state with fetched data
            setProducts(response.data.products);
            setTotalPages(response.data.totalPages);
            setTotalProducts(response.data.totalProducts);
        } catch (err) {
            console.error('Error fetching products:', err);
            // Provide a user-friendly error message
            setError('Failed to load products. Please check your connection or try again later.');
        } finally {
            setLoading(false); // Always set loading to false after request completes
        }
    }, [currentPage, searchQuery, categoryFilter, priceRange, sortOrder]); // Dependencies for useCallback

    // useCallback hook to fetch available categories.
    // In a real application, this would typically be an API call to a `/categories` endpoint.
    const fetchCategories = useCallback(async () => {
        try {
            // Mocking categories for demonstration.
            // In a production app, uncomment the axios call below:
            // const response = await axios.get(`${API_BASE_URL}/categories`);
            // setAvailableCategories(response.data.categories);
            setAvailableCategories(['Electronics', 'Books', 'Clothing', 'Home & Kitchen', 'Sports', 'Beauty']);
        } catch (err) {
            console.error('Error