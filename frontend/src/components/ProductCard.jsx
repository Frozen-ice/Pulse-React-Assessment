import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://via.placeholder.com/300x300?text=No+Image';

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-image-container">
        <img 
          src={imageUrl} 
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        {product.featured && (
          <span className="featured-badge">Featured</span>
        )}
        {product.stock === 0 && (
          <span className="out-of-stock-badge">Out of Stock</span>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        {product.description && (
          <p className="product-description">
            {product.description.length > 100 
              ? `${product.description.substring(0, 100)}...` 
              : product.description}
          </p>
        )}

        <div className="product-rating">
          {product.rating > 0 && (
            <>
              <span className="rating-stars">
                {'★'.repeat(Math.floor(product.rating))}
                {'☆'.repeat(5 - Math.floor(product.rating))}
              </span>
              <span className="rating-value">({product.rating})</span>
              {product.reviewCount > 0 && (
                <span className="review-count">({product.reviewCount})</span>
              )}
            </>
          )}
        </div>

        <div className="product-price">
          <span className="current-price">{formatPrice(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="compare-price">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>

        {product.stock > 0 && product.stock < 10 && (
          <div className="low-stock">Only {product.stock} left in stock</div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;

