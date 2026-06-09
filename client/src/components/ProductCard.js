import React from 'react';
import PropTypes from 'prop-types'; // For type checking props

/**
 * ProductCard Component
 *
 * Displays a single product item with its image, name, price, description, and an "Add to Cart" button.
 * This component is designed to be reusable across product listings, search results, and other product displays.
 *
 * @param {object} props - The component props.
 * @param {object} props.product - The product object containing details like id, name, description, price, imageUrl, and category.
 * @param {function} [props.onAddToCart] - Optional callback function to handle adding the product to the cart.
 * @param {function} [props.onViewDetails] - Optional callback function to handle viewing product details.
 */
const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  // Destructure product properties for easier access
  const { _id, name, description, price, imageUrl, category } = product;

  // Handle click for viewing product details (e.g., navigate to a detail page)
  const handleViewDetailsClick = () => {
    if (onViewDetails) {
      onViewDetails(_id);
    }
    // In a real application, this might also navigate using React Router:
    // navigate(`/products/${_id}`);
  };

  // Handle click for adding to cart
  const handleAddToCartClick = (event) => {
    event.stopPropagation(); // Prevent triggering onViewDetails if button is inside a clickable card
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <div className="product-card" onClick={handleViewDetailsClick} role="button" tabIndex={0} aria-label={`View details for ${name}`}>
      <div className="product-card-image-container">
        <img
          src={imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'} // Fallback image
          alt={name}
          className="product-card-image"
          loading="lazy" // Improve performance by lazy loading images
        />
      </div>
      <div className="product-card-details">
        <h3 className="product-card-name">{name}</h3>
        <p className="product-card-category">{category}</p>
        <p className="product-card-price">${price.toFixed(2)}</p>
        {/* Display a truncated description for card view */}
        <p className="product-card-description">
          {description.length > 100 ? `${description.substring(0, 97)}...` : description}
        </p>
        <div className="product-card-actions">
          <button
            className="product-card-button product-card-add-to-cart"
            onClick={handleAddToCartClick}
            aria-label={`Add ${name} to cart`}
          >
            Add to Cart
          </button>
          {/* Optionally, a separate button for viewing details if the whole card isn't clickable */}
          {/* <button
            className="product-card-button product-card-view-details"
            onClick={handleViewDetailsClick}
            aria-label={`View details for ${name}`}
          >
            View Details
          </button> */}
        </div>
      </div>
    </div>
  );
};

// Define prop types for better development experience and error checking
ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    imageUrl: PropTypes.string, // imageUrl can be optional, provide a fallback
    category: PropTypes.string,
  }).isRequired,
  onAddToCart: PropTypes.func,
  onViewDetails: PropTypes.func,
};

// Set default props for optional functions to prevent errors if not provided
ProductCard.defaultProps = {
  onAddToCart: () => {},
  onViewDetails: () => {},
};

export default ProductCard;