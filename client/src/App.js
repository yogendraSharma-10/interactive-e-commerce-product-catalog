import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

// Import core pages
import ProductListingPage from './pages/ProductListingPage';

// --- Authentication Context ---
// This context manages the user's authentication state across the application.
const AuthContext = createContext(null);

/**
 * AuthProvider component to wrap the application and provide authentication state.
 * It handles login, logout, and initial authentication check from local storage.
 */
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores user data if logged in
  const [isAuthenticated, setIsAuthenticated] = useState