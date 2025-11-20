import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createRequire } from 'module';
import db from './config/database.js';
import { mockData } from './data/mockData.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
// Import routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

// Load environment variables
dotenv.config();

// Provide CommonJS require for ESM files
if (!global.require) {
  global.require = createRequire(import.meta.url);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize mock data
const initializeMockData = () => {
  // Clear existing data
  db.getUsers().length = 0;
  db.getProducts().length = 0;
  db.getCategories().length = 0;
  db.getOrders().length = 0;
  db.getReviews().length = 0;

  // Populate with mock data
  mockData.users.forEach(user => db.createUser(user));
  mockData.categories.forEach(category => db.createCategory(category));
  mockData.products.forEach(product => db.createProduct(product));
  mockData.orders.forEach(order => db.createOrder(order));
  mockData.reviews.forEach(review => db.createReview(review));
  mockData.orders.forEach(order => db.getOrder());
};

// Initialize database with mock data
initializeMockData();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Marketplace API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Marketplace API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      orders: '/api/orders',
      reviews: '/api/reviews',
      cart: '/api/cart'
    },
    documentation: 'See README.md for API documentation'
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
});

