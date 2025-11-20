# Marketplace Backend API

A comprehensive backend API for a marketplace application with mockup data and a complete template structure.

## Features

- 🔐 **Authentication & Authorization** - JWT-based auth with role-based access control
- 🛍️ **Product Management** - CRUD operations for products with filtering and pagination
- 📦 **Category Management** - Hierarchical category system
- 🛒 **Shopping Cart** - Add, update, remove items from cart
- 📝 **Order Management** - Create and track orders with status updates
- ⭐ **Reviews & Ratings** - Product reviews with verified purchase badges
- 👥 **User Management** - User profiles with different roles (buyer, seller, admin)
- 📊 **Mock Data** - Pre-populated with realistic mockup data

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **In-memory Database** - Mock data storage (easily replaceable with real DB)

## Project Structure

```
marketplace/
├── src/
│   ├── config/
│   │   └── database.js          # In-memory database configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── orderController.js
│   │   ├── reviewController.js
│   │   └── cartController.js
│   ├── data/
│   │   └── mockData.js          # Mockup data generator
│   ├── middleware/
│   │   ├── auth.js              # Authentication & authorization
│   │   └── errorHandler.js      # Error handling
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── cartRoutes.js
│   └── server.js                # Main server file
├── .env.example                  # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd marketplace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your configuration:
   ```
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (requires auth)
- `PUT /api/auth/profile` - Update user profile (requires auth)

### Products

- `GET /api/products` - Get all products (supports query params: category, seller, search, featured, minPrice, maxPrice, sort, page, limit)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (requires seller/admin auth)
- `PUT /api/products/:id` - Update product (requires ownership or admin)
- `DELETE /api/products/:id` - Delete product (requires ownership or admin)

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID with subcategories and products
- `POST /api/categories` - Create category (requires admin)
- `PUT /api/categories/:id` - Update category (requires admin)
- `DELETE /api/categories/:id` - Delete category (requires admin)

### Orders

- `GET /api/orders` - Get user's orders (or all orders if admin)
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order (requires auth)
- `PUT /api/orders/:id/status` - Update order status (requires seller/admin)

### Reviews

- `GET /api/reviews` - Get reviews (supports query params: productId, userId)
- `GET /api/reviews/:id` - Get review by ID
- `POST /api/reviews` - Create review (requires auth)
- `PUT /api/reviews/:id` - Update review (requires ownership)
- `DELETE /api/reviews/:id` - Delete review (requires ownership or admin)

### Cart

- `GET /api/cart` - Get user's cart (requires auth)
- `POST /api/cart` - Add item to cart (requires auth)
- `PUT /api/cart/:productId` - Update cart item quantity (requires auth)
- `DELETE /api/cart/:productId` - Remove item from cart (requires auth)
- `DELETE /api/cart` - Clear entire cart (requires auth)

## Mock Data

The API comes pre-populated with mock data:

- **5 Users** (buyers, sellers, admin)
- **7 Categories** (Electronics, Clothing, Home & Garden, etc.)
- **8 Products** (iPhone, MacBook, Nike shoes, etc.)
- **3 Orders** (various statuses)
- **5 Reviews** (with ratings and comments)

### Test Credentials

```
Email: john.doe@example.com
Password: password123
```

All users have the same password: `password123`

## Request Examples

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "firstName": "New",
    "lastName": "User",
    "role": "buyer"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "password123"
  }'
```

### Get Products (with filters)
```bash
curl "http://localhost:3000/api/products?category=cat-6&featured=true&sort=price_asc&page=1&limit=10"
```

### Create Order (requires auth token)
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "items": [
      {
        "productId": "prod-1",
        "quantity": 1
      }
    ],
    "paymentMethod": "credit_card"
  }'
```

## Response Format

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message"
}
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-token>
```

Tokens are obtained from the `/api/auth/login` endpoint.

## User Roles

- **buyer** - Can browse, purchase, and review products
- **seller** - Can create and manage products, view orders
- **admin** - Full access to all resources

## Error Handling

The API includes comprehensive error handling:
- 400 - Bad Request (validation errors)
- 401 - Unauthorized (missing/invalid token)
- 403 - Forbidden (insufficient permissions)
- 404 - Not Found
- 500 - Internal Server Error

## Future Enhancements

This is a template structure that can be extended with:
- Real database integration (MongoDB, PostgreSQL, etc.)
- File upload for product images
- Payment gateway integration
- Email notifications
- Advanced search with full-text search
- Analytics and reporting
- Admin dashboard endpoints
- Product recommendations
- Wishlist functionality

## License

ISC

