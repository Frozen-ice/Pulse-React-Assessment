import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCart } from '../services/api';
import './Navbar.css';

const Navbar = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [loadingCart, setLoadingCart] = useState(false);

  useEffect(() => {
    if (token) {
      fetchCartCount();
    } else {
      setCartCount(0);
    }
  }, [token]);

  const fetchCartCount = async () => {
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
  };

  const handleLogout = () => {
    logout();
    navigate('/products');
    setCartCount(0);
  };

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
              <span className="user-name">
                {user?.firstName || user?.email || 'User'}
              </span>
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
};

export default Navbar;

