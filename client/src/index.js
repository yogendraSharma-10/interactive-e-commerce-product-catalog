import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'; // Global styles for the application

/**
 * The main entry point for the React client-side application.
 * This file sets up the root React component and integrates essential
 * services like client-side routing.
 */

// Create a React root for the application.
// This is the modern way to render React applications starting from React 18.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the main App component into the root.
// React.StrictMode is a tool for highlighting potential problems in an application.
// It activates additional checks and warnings for its descendants during development.
// BrowserRouter is used to enable client-side routing, allowing different URLs
// to display different components without full page reloads.
root.render(
  <React.StrictMode>
    {/* BrowserRouter provides the routing context to all components within it. */}
    <BrowserRouter>
      {/* The main application component where all other components are rendered. */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// import reportWebVitals from './reportWebVitals';
// reportWebVitals(); // Uncomment if performance monitoring is needed.