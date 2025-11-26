# React Frontend Assessment (30-40 minutes)

## Overview
Build a simple React application that integrates with the Marketplace Backend API. Focus on core functionality and clean code.

## Backend API
- **Base URL**: `http://localhost:3000/api`
- **Test Credentials**: 
  - Email: `john.doe@example.com`
  - Password: `password123`

## Time Allocation (30-40 minutes)

### Phase 1: Setup & Authentication 
- [ ] Create React app (Vite/CRA)
- [ ] Install dependencies (axios, react-router-dom)
- [ ] Set up basic routing
- [ ] Create Login page with form
- [ ] Implement login API call
- [ ] Store JWT token (localStorage)
- [ ] Basic protected route

### Phase 2: Product Listing
- [ ] Create Products page
- [ ] Fetch products from `/api/products`
- [ ] Display product list (name, price, image)
- [ ] Basic styling/layout
- [ ] Loading state
- [ ] Error handling

### Phase 3: Product Details & Cart
- [ ] Product detail page/component
- [ ] Add to cart functionality
- [ ] Cart state management (Context/useState)
- [ ] Display cart items count

### Phase 4: Polish
- [ ] Navigation bar with login/logout
- [ ] Basic error messages
- [ ] Simple styling improvements

## Required Features

### ✅ Must Have (Core)
1. **Authentication**
   - Login form (`POST /api/auth/login`)
   - Store JWT token
   - Protected routes
   - Logout button

2. **Products**
   - List all products (`GET /api/products`)
   - Display product information
   - View product details (`GET /api/products/:id`)

3. **Shopping Cart**
   - Add items to cart
   - Display cart items
   - Update quantities
   - Remove items

### ⭐ Nice to Have (If time permits)
- Product filtering/search
- User profile page
- Order history
- Better error handling
- Responsive design

## API Endpoints to Use

### Authentication
```
POST /api/auth/login
Body: { "email": "...", "password": "..." }
Response: { "success": true, "data": { "token": "...", "user": {...} } }
```

### Products
```
GET /api/products
Headers: (optional) Authorization: Bearer <token>
Response: { "success": true, "data": { "products": [...] } }

GET /api/products/:id
Response: { "success": true, "data": { "product": {...} } }
```

### Cart (Optional - can use local state)
```
GET /api/cart
Headers: Authorization: Bearer <token>

POST /api/cart
Headers: Authorization: Bearer <token>
Body: { "productId": "...", "quantity": 1 }
```

## Project Structure Suggestion

```
src/
├── components/
│   ├── ProductCard.jsx
│   ├── Cart.jsx
│   └── Navbar.jsx
├── pages/
│   ├── Login.jsx
│   ├── Products.jsx
│   └── ProductDetail.jsx
├── context/
│   └── AuthContext.jsx (optional)
├── services/
│   └── api.js (API calls)
├── App.jsx
└── main.jsx
```

## Assessment Criteria

### Functionality (50%)
- Login works and token is stored
- Products are fetched and displayed
- Can view product details
- Cart functionality works

### Code Quality (30%)
- Clean component structure
- Proper state management
- Error handling
- Reusable components

### UI/UX (20%)
- Basic styling
- Loading states
- Error messages
- User-friendly navigation

## Quick Start Commands

```bash
# Create React app
npm create vite@latest . -- --template react
# or
npx create-react-app .

# Install dependencies
npm install axios react-router-dom

# Start dev server
npm run dev
# or
npm start
```

## Example API Service

```javascript
// services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (email, password) => 
  api.post('/auth/login', { email, password });

export const getProducts = () => 
  api.get('/products');

export const getProduct = (id) => 
  api.get(`/products/${id}`);

export default api;
```

## Notes
- **Don't worry about perfect styling** - focus on functionality
- **Use simple state management** - useState/Context is fine
- **Handle errors gracefully** - show user-friendly messages
- **Test with provided credentials** before submitting
- **Comment your code** if you make design decisions

## Deliverables
1. Working React application
2. Can login and view products
3. Can add items to cart
4. Clean, readable code

Good luck! 🚀
