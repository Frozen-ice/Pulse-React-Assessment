import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import './ProductCard.css';

const ProductCard = memo(({ product }) => {
  const imageUrl = useMemo(() => {
    return product.images && product.images.length > 0 
      ? product.images[0] 
      : 'https://via.placeholder.com/300x300?text=No+Image';
  }, [product.images]);

  const formattedPrice = useMemo(() => formatPrice(product.price), [product.price]);

  const comparePrice = useMemo(() => {
    if (product.compareAtPrice && product.compareAtPrice > product.price) {
      return formatPrice(product.compareAtPrice);
    }
    return null;
  }, [product.compareAtPrice, product.price]);

  const truncatedDescription = useMemo(() => {
    if (!product.description) return null;
    return product.description.length > 100 
      ? `${product.description.substring(0, 100)}...` 
      : product.description;
  }, [product.description]);

  const ratingStars = useMemo(() => {
    if (product.rating <= 0) return null;
    const fullStars = Math.floor(product.rating);
    const emptyStars = 5 - fullStars;
    return {
      full: '★'.repeat(fullStars),
      empty: '☆'.repeat(emptyStars)
    };
  }, [product.rating]);

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
        
        {truncatedDescription && (
          <p className="product-description">{truncatedDescription}</p>
        )}

        {ratingStars && (
          <div className="product-rating">
            <span className="rating-stars">
              {ratingStars.full}
              {ratingStars.empty}
            </span>
            <span className="rating-value">({product.rating})</span>
            {product.reviewCount > 0 && (
              <span className="review-count">({product.reviewCount})</span>
            )}
          </div>
        )}

        <div className="product-price">
          <span className="current-price">{formattedPrice}</span>
          {comparePrice && (
            <span className="compare-price">{comparePrice}</span>
          )}
        </div>

        {product.stock > 0 && product.stock < 10 && (
          <div className="low-stock">Only {product.stock} left in stock</div>
        )}
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
