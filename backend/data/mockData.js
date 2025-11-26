import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

// Generate mock users
const generateUsers = () => {
  const hashedPassword = bcrypt.hashSync('password123', 10);
  
  return [
    {
      id: 'user-1',
      email: 'john.doe@example.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'buyer',
      phone: '+1234567890',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      createdAt: new Date('2024-01-15').toISOString(),
      isVerified: true
    },
    {
      id: 'user-2',
      email: 'jane.smith@example.com',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'seller',
      phone: '+1234567891',
      address: {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        country: 'USA'
      },
      createdAt: new Date('2024-01-20').toISOString(),
      isVerified: true
    },
    {
      id: 'user-3',
      email: 'bob.wilson@example.com',
      password: hashedPassword,
      firstName: 'Bob',
      lastName: 'Wilson',
      role: 'seller',
      phone: '+1234567892',
      address: {
        street: '789 Pine Rd',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'USA'
      },
      createdAt: new Date('2024-02-01').toISOString(),
      isVerified: true
    },
    {
      id: 'user-4',
      email: 'alice.brown@example.com',
      password: hashedPassword,
      firstName: 'Alice',
      lastName: 'Brown',
      role: 'buyer',
      phone: '+1234567893',
      address: {
        street: '321 Elm St',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001',
        country: 'USA'
      },
      createdAt: new Date('2024-02-10').toISOString(),
      isVerified: false
    },
    {
      id: 'user-5',
      email: 'admin@marketplace.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      phone: '+1234567894',
      address: {
        street: '999 Admin Blvd',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94101',
        country: 'USA'
      },
      createdAt: new Date('2024-01-01').toISOString(),
      isVerified: true
    }
  ];
};

// Generate mock categories
const generateCategories = () => {
  return [
    {
      id: 'cat-1',
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and gadgets',
      image: 'https://placehold.co/300x200?text=Electronics',
      parentId: null,
      createdAt: new Date('2024-01-01').toISOString()
    },
    {
      id: 'cat-2',
      name: 'Clothing',
      slug: 'clothing',
      description: 'Fashion and apparel',
      image: 'https://placehold.co/300x200?text=Clothing',
      parentId: null,
      createdAt: new Date('2024-01-01').toISOString()
    },
    {
      id: 'cat-3',
      name: 'Home & Garden',
      slug: 'home-garden',
      description: 'Home improvement and garden supplies',
      image: 'https://placehold.co/300x200?text=Home+Garden',
      parentId: null,
      createdAt: new Date('2024-01-01').toISOString()
    },
    {
      id: 'cat-4',
      name: 'Books',
      slug: 'books',
      description: 'Books and literature',
      image: 'https://placehold.co/300x200?text=Books',
      parentId: null,
      createdAt: new Date('2024-01-01').toISOString()
    },
    {
      id: 'cat-5',
      name: 'Sports & Outdoors',
      slug: 'sports-outdoors',
      description: 'Sports equipment and outdoor gear',
      image: 'https://placehold.co/300x200?text=Sports',
      parentId: null,
      createdAt: new Date('2024-01-01').toISOString()
    },
    {
      id: 'cat-6',
      name: 'Smartphones',
      slug: 'smartphones',
      description: 'Mobile phones and accessories',
      image: 'https://placehold.co/300x200?text=Smartphones',
      parentId: 'cat-1',
      createdAt: new Date('2024-01-01').toISOString()
    },
    {
      id: 'cat-7',
      name: 'Laptops',
      slug: 'laptops',
      description: 'Laptop computers',
      image: 'https://placehold.co/300x200?text=Laptops',
      parentId: 'cat-1',
      createdAt: new Date('2024-01-01').toISOString()
    }
  ];
};

// Generate mock products
const generateProducts = () => {
  return [
    {
      id: 'prod-1',
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description: 'Latest iPhone with advanced features and powerful A17 Pro chip',
      price: 999.99,
      compareAtPrice: 1099.99,
      categoryId: 'cat-6',
      sellerId: 'user-2',
      images: [
        'https://placehold.co/800x600?text=iPhone+15+Pro+1',
        'https://placehold.co/800x600?text=iPhone+15+Pro+2'
      ],
      stock: 50,
      sku: 'IPH15PRO-001',
      status: 'active',
      featured: true,
      rating: 4.8,
      reviewCount: 234,
      tags: ['smartphone', 'apple', 'premium'],
      specifications: {
        storage: '256GB',
        color: 'Natural Titanium',
        screen: '6.1 inch Super Retina XDR',
        processor: 'A17 Pro'
      },
      createdAt: new Date('2024-01-25').toISOString(),
      updatedAt: new Date('2024-01-25').toISOString()
    },
    {
      id: 'prod-2',
      name: 'MacBook Pro 16"',
      slug: 'macbook-pro-16',
      description: 'Powerful laptop for professionals with M3 Max chip',
      price: 2499.99,
      compareAtPrice: 2799.99,
      categoryId: 'cat-7',
      sellerId: 'user-2',
      images: [
        'https://placehold.co/800x600?text=MacBook+Pro+1',
        'https://placehold.co/800x600?text=MacBook+Pro+2'
      ],
      stock: 25,
      sku: 'MBP16-001',
      status: 'active',
      featured: true,
      rating: 4.9,
      reviewCount: 156,
      tags: ['laptop', 'apple', 'professional'],
      specifications: {
        storage: '1TB SSD',
        memory: '32GB',
        processor: 'M3 Max',
        display: '16.2 inch Liquid Retina XDR'
      },
      createdAt: new Date('2024-01-26').toISOString(),
      updatedAt: new Date('2024-01-26').toISOString()
    },
    {
      id: 'prod-3',
      name: 'Nike Air Max 90',
      slug: 'nike-air-max-90',
      description: 'Classic running shoes with comfortable cushioning',
      price: 119.99,
      compareAtPrice: 129.99,
      categoryId: 'cat-2',
      sellerId: 'user-3',
      images: [
        'https://placehold.co/800x600?text=Nike+Air+Max+90'
      ],
      stock: 100,
      sku: 'NIKE-AM90-001',
      status: 'active',
      featured: false,
      rating: 4.5,
      reviewCount: 89,
      tags: ['shoes', 'nike', 'sports'],
      specifications: {
        size: 'Available in sizes 7-13',
        color: 'White/Black',
        material: 'Leather and Mesh'
      },
      createdAt: new Date('2024-02-05').toISOString(),
      updatedAt: new Date('2024-02-05').toISOString()
    },
    {
      id: 'prod-4',
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      description: 'Premium Android smartphone with S Pen and advanced camera',
      price: 1199.99,
      compareAtPrice: 1299.99,
      categoryId: 'cat-6',
      sellerId: 'user-3',
      images: [
        'https://placehold.co/800x600?text=Galaxy+S24+Ultra+1',
        'https://placehold.co/800x600?text=Galaxy+S24+Ultra+2'
      ],
      stock: 40,
      sku: 'SGS24U-001',
      status: 'active',
      featured: true,
      rating: 4.7,
      reviewCount: 198,
      tags: ['smartphone', 'samsung', 'android'],
      specifications: {
        storage: '512GB',
        color: 'Titanium Black',
        screen: '6.8 inch Dynamic AMOLED',
        processor: 'Snapdragon 8 Gen 3'
      },
      createdAt: new Date('2024-02-08').toISOString(),
      updatedAt: new Date('2024-02-08').toISOString()
    },
    {
      id: 'prod-5',
      name: 'The Great Gatsby',
      slug: 'the-great-gatsby',
      description: 'Classic American novel by F. Scott Fitzgerald',
      price: 12.99,
      compareAtPrice: 15.99,
      categoryId: 'cat-4',
      sellerId: 'user-2',
      images: [
        'https://placehold.co/800x600?text=Great+Gatsby'
      ],
      stock: 200,
      sku: 'BOOK-GG-001',
      status: 'active',
      featured: false,
      rating: 4.6,
      reviewCount: 342,
      tags: ['book', 'fiction', 'classic'],
      specifications: {
        pages: 180,
        format: 'Paperback',
        language: 'English',
        publisher: 'Scribner'
      },
      createdAt: new Date('2024-02-12').toISOString(),
      updatedAt: new Date('2024-02-12').toISOString()
    },
    {
      id: 'prod-6',
      name: 'Yoga Mat Premium',
      slug: 'yoga-mat-premium',
      description: 'Non-slip yoga mat with carrying strap',
      price: 39.99,
      compareAtPrice: 49.99,
      categoryId: 'cat-5',
      sellerId: 'user-3',
      images: [
        'https://placehold.co/800x600?text=Yoga+Mat'
      ],
      stock: 75,
      sku: 'YOGA-MAT-001',
      status: 'active',
      featured: false,
      rating: 4.4,
      reviewCount: 67,
      tags: ['yoga', 'fitness', 'exercise'],
      specifications: {
        dimensions: '72" x 24" x 0.25"',
        material: 'TPE',
        weight: '2.5 lbs',
        color: 'Purple'
      },
      createdAt: new Date('2024-02-15').toISOString(),
      updatedAt: new Date('2024-02-15').toISOString()
    },
    {
      id: 'prod-7',
      name: 'Coffee Maker Deluxe',
      slug: 'coffee-maker-deluxe',
      description: 'Programmable coffee maker with thermal carafe',
      price: 89.99,
      compareAtPrice: 119.99,
      categoryId: 'cat-3',
      sellerId: 'user-2',
      images: [
        'https://placehold.co/800x600?text=Coffee+Maker+1',
        'https://placehold.co/800x600?text=Coffee+Maker+2'
      ],
      stock: 30,
      sku: 'COFFEE-001',
      status: 'active',
      featured: false,
      rating: 4.3,
      reviewCount: 123,
      tags: ['kitchen', 'appliance', 'coffee'],
      specifications: {
        capacity: '12 cups',
        material: 'Stainless Steel',
        features: 'Programmable, Auto Shut-off'
      },
      createdAt: new Date('2024-02-18').toISOString(),
      updatedAt: new Date('2024-02-18').toISOString()
    },
    {
      id: 'prod-8',
      name: 'Wireless Headphones Pro',
      slug: 'wireless-headphones-pro',
      description: 'Noise-cancelling wireless headphones with 30-hour battery',
      price: 199.99,
      compareAtPrice: 249.99,
      categoryId: 'cat-1',
      sellerId: 'user-3',
      images: [
        'https://placehold.co/800x600?text=Headphones+1',
        'https://placehold.co/800x600?text=Headphones+2'
      ],
      stock: 60,
      sku: 'HEADPHONES-001',
      status: 'active',
      featured: true,
      rating: 4.7,
      reviewCount: 278,
      tags: ['audio', 'headphones', 'wireless'],
      specifications: {
        battery: '30 hours',
        noiseCancelling: 'Active',
        connectivity: 'Bluetooth 5.0',
        color: 'Black'
      },
      createdAt: new Date('2024-02-20').toISOString(),
      updatedAt: new Date('2024-02-20').toISOString()
    }
  ];
};

// Generate mock orders
const generateOrders = () => {
  return [
    {
      id: 'order-1',
      userId: 'user-1',
      items: [
        {
          productId: 'prod-1',
          quantity: 1,
          price: 999.99,
          name: 'iPhone 15 Pro'
        },
        {
          productId: 'prod-8',
          quantity: 1,
          price: 199.99,
          name: 'Wireless Headphones Pro'
        }
      ],
      subtotal: 1199.98,
      tax: 96.00,
      shipping: 15.99,
      total: 1311.97,
      status: 'delivered',
      shippingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      paymentMethod: 'credit_card',
      paymentStatus: 'paid',
      createdAt: new Date('2024-02-01').toISOString(),
      deliveredAt: new Date('2024-02-05').toISOString()
    },
    {
      id: 'order-2',
      userId: 'user-1',
      items: [
        {
          productId: 'prod-3',
          quantity: 2,
          price: 119.99,
          name: 'Nike Air Max 90'
        }
      ],
      subtotal: 239.98,
      tax: 19.20,
      shipping: 10.99,
      total: 270.17,
      status: 'shipped',
      shippingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      paymentMethod: 'paypal',
      paymentStatus: 'paid',
      createdAt: new Date('2024-02-10').toISOString(),
      shippedAt: new Date('2024-02-12').toISOString()
    },
    {
      id: 'order-3',
      userId: 'user-4',
      items: [
        {
          productId: 'prod-5',
          quantity: 3,
          price: 12.99,
          name: 'The Great Gatsby'
        },
        {
          productId: 'prod-6',
          quantity: 1,
          price: 39.99,
          name: 'Yoga Mat Premium'
        }
      ],
      subtotal: 78.96,
      tax: 6.32,
      shipping: 5.99,
      total: 91.27,
      status: 'pending',
      shippingAddress: {
        street: '321 Elm St',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001',
        country: 'USA'
      },
      paymentMethod: 'credit_card',
      paymentStatus: 'pending',
      createdAt: new Date('2024-02-15').toISOString()
    }
  ];
};

// Generate mock reviews
const generateReviews = () => {
  return [
    {
      id: 'review-1',
      productId: 'prod-1',
      userId: 'user-1',
      rating: 5,
      title: 'Amazing phone!',
      comment: 'The iPhone 15 Pro exceeded my expectations. The camera quality is outstanding and the performance is smooth.',
      verifiedPurchase: true,
      createdAt: new Date('2024-02-06').toISOString()
    },
    {
      id: 'review-2',
      productId: 'prod-1',
      userId: 'user-4',
      rating: 4,
      title: 'Great but expensive',
      comment: 'Love the phone but the price is quite high. Still worth it for the features.',
      verifiedPurchase: false,
      createdAt: new Date('2024-02-08').toISOString()
    },
    {
      id: 'review-3',
      productId: 'prod-2',
      userId: 'user-1',
      rating: 5,
      title: 'Perfect for work',
      comment: 'The MacBook Pro handles all my professional tasks effortlessly. Battery life is excellent.',
      verifiedPurchase: true,
      createdAt: new Date('2024-02-07').toISOString()
    },
    {
      id: 'review-4',
      productId: 'prod-3',
      userId: 'user-1',
      rating: 4,
      title: 'Comfortable shoes',
      comment: 'Very comfortable for daily wear. Good quality materials.',
      verifiedPurchase: true,
      createdAt: new Date('2024-02-13').toISOString()
    },
    {
      id: 'review-5',
      productId: 'prod-8',
      userId: 'user-4',
      rating: 5,
      title: 'Best headphones I\'ve owned',
      comment: 'The noise cancellation is incredible. Battery lasts forever!',
      verifiedPurchase: false,
      createdAt: new Date('2024-02-22').toISOString()
    }
  ];
};

export const mockData = {
  users: generateUsers(),
  categories: generateCategories(),
  products: generateProducts(),
  orders: generateOrders(),
  reviews: generateReviews()
};

