import { useState, useEffect, useCallback, memo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCart } from '../services/api';
import './Navbar.css';

const Navbar = memo(() => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [loadingCart, setLoadingCart] = useState(false);

  const fetchCartCount = useCallback(async () => {
    if (!token) {
      setCartCount(0);
      return;
    }

    setLoadingCart(true);
    try {
      const response = await getCart();
      if (response.success) {
        setCartCount(response.data.itemCount || 0);
      }
    } catch (error) {
      // If cart fetch fails, set count to 0
      setCartCount(0);
    } finally {
      setLoadingCart(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  // Refresh cart count when navigating to/from cart page
  useEffect(() => {
    if (token && (location.pathname === '/cart' || location.pathname === '/products')) {
      fetchCartCount();
    }
  }, [location.pathname, token, fetchCartCount]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/products');
    setCartCount(0);
  }, [logout, navigate]);

  const userName = user?.firstName || user?.email || 'User';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/products" className="navbar-brand">
          <span className="brand-icon">🛍️</span>
          <span className="brand-text">Marketplace</span>
        </Link>

        <div className="navbar-links">
          <Link to="/products" className="nav-link">
            Products
          </Link>
          
          {token && (
            <Link to="/cart" className="nav-link cart-link">
              <span className="cart-icon">🛒</span>
              <span className="cart-text">Cart</span>
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </Link>
          )}

          {token ? (
            <div className="user-menu">
              <span className="user-name">{userName}</span>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-button">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
