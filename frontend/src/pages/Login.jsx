import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginAPI } from '../services/api';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page user was trying to access, or default to products
  const from = location.state?.from?.pathname || '/products';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await loginAPI(email, password);
      
      if (response.success) {
        // Store token and user data in AuthContext
        setAuth(response.data.token, response.data.user);
        
        // Redirect to the page user was trying to access, or products page
        navigate(from, { replace: true });
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      // Handle API errors
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         'An error occurred during login. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>
        <p className="login-subtitle">Sign in to your account</p>
        
        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
              required
              autoComplete="current-password"
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-info">
          <p className="test-credentials">
            <strong>Test Credentials:</strong><br />
            Email: john.doe@example.com<br />
            Password: password123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

