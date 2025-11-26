import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeFromCart, clearCart } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatPrice';
import './Cart.css';

const Cart = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const [message, setMessage] = useState('');

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getCart();

      if (response.success) {
        setCart(response.data);
      } else {
        setError(response.message || 'Failed to fetch cart');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
        err.message ||
        'An error occurred while fetching your cart. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }
    fetchCart();
  }, [token, navigate, fetchCart]);

  const handleUpdateQuantity = useCallback(async (productId, newQuantity) => {
    if (newQuantity < 1) {
      return;
    }

    setUpdatingItems(prev => new Set(prev).add(productId));
    setMessage('');

    try {
      const response = await updateCartItem(productId, newQuantity);

      if (response.success) {
        await fetchCart();
      } else {
        setMessage(response.message || 'Failed to update item');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
        err.message ||
        'Failed to update item. Please try again.';
      setMessage(errorMessage);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  }, [fetchCart]);

  const handleRemoveItem = useCallback(async (productId) => {
    setUpdatingItems(prev => new Set(prev).add(productId));
    setMessage('');

    try {
      const response = await removeFromCart(productId);

      if (response.success) {
        await fetchCart();
        setMessage('Item removed from cart');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(response.message || 'Failed to remove item');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
        err.message ||
        'Failed to remove item. Please try again.';
      setMessage(errorMessage);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  }, [fetchCart]);

  const handleClearCart = useCallback(async () => {
    if (!window.confirm('Are you sure you want to clear your entire cart?')) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await clearCart();

      if (response.success) {
        await fetchCart();
        setMessage('Cart cleared successfully');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(response.message || 'Failed to clear cart');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
        err.message ||
        'Failed to clear cart. Please try again.';
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  const handleQuantityChange = useCallback((productId, delta) => {
    const item = cart?.items?.find(i => i.product?.id === productId);
    if (!item) return;
    
    const newQuantity = item.quantity + delta;
    if (newQuantity >= 1 && newQuantity <= item.product.stock) {
      handleUpdateQuantity(productId, newQuantity);
    }
  }, [cart, handleUpdateQuantity]);

  const handleQuantityInputChange = useCallback((productId, value) => {
    const item = cart?.items?.find(i => i.product?.id === productId);
    if (!item) return;
    
    const val = parseInt(value) || 1;
    const newQuantity = Math.max(1, Math.min(val, item.product.stock));
    handleUpdateQuantity(productId, newQuantity);
  }, [cart, handleUpdateQuantity]);

  const cartItems = useMemo(() => {
    return cart?.items?.filter(item => item.product) || [];
  }, [cart?.items]);

  const subtotal = useMemo(() => {
    return cart?.subtotal || 0;
  }, [cart?.subtotal]);

  const itemCount = useMemo(() => {
    return cart?.itemCount || 0;
  }, [cart?.itemCount]);

  if (loading && !cart) {
    return (
      <div className="cart-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchCart} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!cart || cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h1>Shopping Cart</h1>
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Start shopping to add items to your cart!</p>
          <Link to="/products" className="shop-button">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <p className="cart-item-count">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </p>
      </div>

      {message && (
        <div className={`cart-message ${message.includes('success') || message.includes('removed') || message.includes('cleared') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => {
            const product = item.product;
            const itemTotal = product.price * item.quantity;
            const isUpdating = updatingItems.has(product.id);
            const imageUrl = product.images && product.images.length > 0
              ? product.images[0]
              : 'https://via.placeholder.com/200x200?text=No+Image';

            return (
              <div key={item.id} className="cart-item">
                <Link to={`/products/${product.id}`} className="cart-item-image">
                  <img src={imageUrl} alt={product.name} />
                </Link>

                <div className="cart-item-details">
                  <Link to={`/products/${product.id}`} className="cart-item-name">
                    {product.name}
                  </Link>
                  <div className="cart-item-price">
                    {formatPrice(product.price)} each
                  </div>
                </div>

                <div className="cart-item-quantity">
                  <label htmlFor={`quantity-${product.id}`}>Quantity:</label>
                  <div className="quantity-controls">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(product.id, -1)}
                      disabled={isUpdating || item.quantity <= 1}
                      className="quantity-button"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      id={`quantity-${product.id}`}
                      min="1"
                      max={product.stock}
                      value={item.quantity}
                      onChange={(e) => handleQuantityInputChange(product.id, e.target.value)}
                      disabled={isUpdating}
                      className="quantity-input"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(product.id, 1)}
                      disabled={isUpdating || item.quantity >= product.stock}
                      className="quantity-button"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  {product.stock < 10 && product.stock > 0 && (
                    <div className="stock-warning">
                      Only {product.stock} left
                    </div>
                  )}
                </div>

                <div className="cart-item-total">
                  <div className="item-total-price">{formatPrice(itemTotal)}</div>
                  <button
                    onClick={() => handleRemoveItem(product.id)}
                    disabled={isUpdating}
                    className="remove-button"
                    aria-label="Remove item"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          <div className="cart-actions">
            <button onClick={handleClearCart} className="clear-cart-button">
              Clear Cart
            </button>
          </div>
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'}):</span>
            <span className="summary-value">{formatPrice(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span className="summary-value">Calculated at checkout</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span className="summary-value">{formatPrice(subtotal)}</span>
          </div>
          <button className="checkout-button" disabled>
            Proceed to Checkout
          </button>
          <Link to="/products" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
