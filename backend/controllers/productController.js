import db from '../config/database.js';

export const getProducts = (req, res, next) => {
  try {
    const { category, seller, search, featured, minPrice, maxPrice, sort, page = 1, limit = 20 } = req.query;
    
    let products = db.getProducts();
    // Filter by category
    if (category) {
      products = products.filter(p => p.categoryId === category);
    }

    // Filter by seller
    if (seller) {
      products = products.filter(p => p.sellerId === seller);
    }

    // Search by name or description
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by featured
    if (featured === 'true') {
      products = products.filter(p => p.featured === true);
    }

    // Filter by price range
    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }

    // Sort
    if (sort === 'price_asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedProducts = products.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        products: paginatedProducts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: products.length,
          pages: Math.ceil(products.length / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = (req, res, next) => {
  try {
    const product = db.getProductById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get reviews for this product
    const reviews = db.getReviewsByProduct(req.params.id);

    res.json({
      success: true,
      data: {
        ...product,
        reviews
      }
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      compareAtPrice,
      categoryId,
      images,
      stock,
      sku,
      tags,
      specifications
    } = req.body;

    // Check if seller
    const user = db.getUserById(req.user.id);
    if (user.role !== 'seller' && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only sellers can create products'
      });
    }

    const product = {
      id: `prod-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description,
      price: parseFloat(price),
      compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
      categoryId,
      sellerId: req.user.id,
      images: images || [],
      stock: parseInt(stock) || 0,
      sku: sku || `SKU-${Date.now()}`,
      status: 'active',
      featured: false,
      rating: 0,
      reviewCount: 0,
      tags: tags || [],
      specifications: specifications || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.createProduct(product);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = (req, res, next) => {
  try {
    const product = db.getProductById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user owns the product or is admin
    const user = db.getUserById(req.user.id);
    if (product.sellerId !== req.user.id && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this product'
      });
    }

    const updates = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    const updatedProduct = db.updateProduct(req.params.id, updates);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = (req, res, next) => {
  try {
    const product = db.getProductById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user owns the product or is admin
    const user = db.getUserById(req.user.id);
    if (product.sellerId !== req.user.id && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this product'
      });
    }

    db.deleteProduct(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

