import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ENDPOINTS ====================

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Response with token and user data
 */
export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

/**
 * Register new user
 * @param {Object} userData - User registration data
 * @returns {Promise} Response with token and user data
 */
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

/**
 * Get user profile (requires authentication)
 * @returns {Promise} Response with user data
 */
export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

/**
 * Update user profile (requires authentication)
 * @param {Object} userData - Updated user data
 * @returns {Promise} Response with updated user data
 */
export const updateProfile = async (userData) => {
  const response = await api.put('/auth/profile', userData);
  return response.data;
};

// ==================== PRODUCT ENDPOINTS ====================

/**
 * Get all products
 * @param {Object} params - Query parameters (category, search, sort, page, limit, etc.)
 * @returns {Promise} Response with products array and pagination info
 */
export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

/**
 * Get product by ID
 * @param {string} id - Product ID
 * @returns {Promise} Response with product data and reviews
 */
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// ==================== CART ENDPOINTS ====================

/**
 * Get user's cart (requires authentication)
 * @returns {Promise} Response with cart items, subtotal, and item count
 */
export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};

/**
 * Add item to cart (requires authentication)
 * @param {string} productId - Product ID to add
 * @param {number} quantity - Quantity to add (default: 1)
 * @returns {Promise} Response with cart item data
 */
export const addToCart = async (productId, quantity = 1) => {
  const response = await api.post('/cart', { productId, quantity });
  return response.data;
};

/**
 * Update cart item quantity (requires authentication)
 * @param {string} productId - Product ID to update
 * @param {number} quantity - New quantity
 * @returns {Promise} Response with updated cart item data
 */
export const updateCartItem = async (productId, quantity) => {
  const response = await api.put(`/cart/${productId}`, { quantity });
  return response.data;
};

/**
 * Remove item from cart (requires authentication)
 * @param {string} productId - Product ID to remove
 * @returns {Promise} Response with success message
 */
export const removeFromCart = async (productId) => {
  const response = await api.delete(`/cart/${productId}`);
  return response.data;
};

/**
 * Clear entire cart (requires authentication)
 * @returns {Promise} Response with success message
 */
export const clearCart = async () => {
  const response = await api.delete('/cart');
  return response.data;
};

// ==================== CATEGORY ENDPOINTS (Optional) ====================

/**
 * Get all categories
 * @returns {Promise} Response with categories array
 */
export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

/**
 * Get category by ID
 * @param {string} id - Category ID
 * @returns {Promise} Response with category data
 */
export const getCategoryById = async (id) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

export default api;

