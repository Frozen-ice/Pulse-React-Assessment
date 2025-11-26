import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, addToCart } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatPrice';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await getProductById(id);
      
      if (response.success) {
        setProduct(response.data);
        setQuantity(1); // Reset quantity when product changes
      } else {
        setError(response.message || 'Product not found');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         'An error occurred while fetching the product. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = useCallback(async () => {
    if (!token) {
      navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
      return;
    }

    setAddingToCart(true);
    setCartMessage('');

    try {
      const response = await addToCart(id, quantity);
      
      if (response.success) {
        setCartMessage('Item added to cart successfully!');
        setTimeout(() => setCartMessage(''), 3000);
      } else {
        setCartMessage(response.message || 'Failed to add item to cart');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Failed to add item to cart. Please try again.';
      setCartMessage(errorMessage);
    } finally {
      setAddingToCart(false);
    }
  }, [token, id, quantity, navigate]);

  const handleQuantityChange = useCallback((delta) => {
    if (!product) return;
    setQuantity(prev => {
      const newQuantity = prev + delta;
      return Math.max(1, Math.min(newQuantity, product.stock));
    });
  }, [product]);

  const handleQuantityInputChange = useCallback((e) => {
    if (!product) return;
    const val = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, Math.min(val, product.stock)));
  }, [product]);

  const images = useMemo(() => {
    return product?.images && product.images.length > 0 
      ? product.images 
      : ['https://via.placeholder.com/800x600?text=No+Image'];
  }, [product?.images]);

  const currentPrice = useMemo(() => {
    return product ? formatPrice(product.price) : '';
  }, [product?.price]);

  const comparePrice = useMemo(() => {
    if (product?.compareAtPrice && product.compareAtPrice > product.price) {
      return formatPrice(product.compareAtPrice);
    }
    return null;
  }, [product?.compareAtPrice, product?.price]);

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-container">
        <div className="error-container">
          <h2>Product Not Found</h2>
          <p>{error || 'The product you are looking for does not exist.'}</p>
          <Link to="/products" className="back-button">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <Link to="/products" className="back-link">
        ← Back to Products
      </Link>

      <div className="product-detail-content">
        <div className="product-images">
          <div className="main-image">
            <img 
              src={images[selectedImageIndex]} 
              alt={product.name}
              className="main-product-image"
            />
            {product.featured && (
              <span className="featured-badge">Featured</span>
            )}
          </div>
          
          {images.length > 1 && (
            <div className="image-thumbnails">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                  aria-label={`View image ${index + 1}`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>

          {product.rating > 0 && (
            <div className="product-rating-section">
              <div className="rating-display">
                <span className="rating-stars">
                  {'★'.repeat(Math.floor(product.rating))}
                  {'☆'.repeat(5 - Math.floor(product.rating))}
                </span>
                <span className="rating-value">{product.rating}</span>
              </div>
              {product.reviewCount > 0 && (
                <span className="review-count">
                  ({product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'})
                </span>
              )}
            </div>
          )}

          <div className="product-price-section">
            <span className="current-price">{currentPrice}</span>
            {comparePrice && (
              <span className="compare-price">{comparePrice}</span>
            )}
          </div>

          {product.description && (
            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          )}

          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="product-specifications">
              <h3>Specifications</h3>
              <dl className="specs-list">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="spec-item">
                    <dt>{key.charAt(0).toUpperCase() + key.slice(1)}:</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="product-stock">
            {product.stock > 0 ? (
              <span className="in-stock">
                {product.stock > 10 
                  ? `In Stock (${product.stock} available)`
                  : `Only ${product.stock} left in stock!`}
              </span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>

          {product.stock > 0 && (
            <div className="add-to-cart-section">
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <div className="quantity-controls">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="quantity-button"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={handleQuantityInputChange}
                    className="quantity-input"
                  />
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="quantity-button"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stock === 0}
                className="add-to-cart-button"
              >
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>

              {cartMessage && (
                <div className={`cart-message ${cartMessage.includes('success') ? 'success' : 'error'}`}>
                  {cartMessage}
                </div>
              )}
            </div>
          )}

          {product.tags && product.tags.length > 0 && (
            <div className="product-tags">
              {product.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {product.reviews && product.reviews.length > 0 && (
        <div className="product-reviews">
          <h2>Reviews ({product.reviews.length})</h2>
          <div className="reviews-list">
            {product.reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <div className="reviewer-info">
                    <strong>{review.userName || 'Anonymous'}</strong>
                    <div className="review-rating">
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {review.comment && (
                  <p className="review-comment">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
