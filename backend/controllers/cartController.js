import db from '../config/database.js';

export const getCart = (req, res, next) => {
  try {
    const cartItems = db.getCartByUser(req.user.id);
    
    // Enrich cart items with product details
    const enrichedCart = cartItems.map(item => {
      const product = db.getProductById(item.productId);
      return {
        ...item,
        product: product ? {
          id: product.id,
          name: product.name,
          price: product.price,
          images: product.images,
          stock: product.stock
        } : null
      };
    });

    const subtotal = enrichedCart.reduce((sum, item) => {
      return sum + (item.product ? item.product.price * item.quantity : 0);
    }, 0);

    res.json({
      success: true,
      data: {
        items: enrichedCart,
        subtotal: parseFloat(subtotal.toFixed(2)),
        itemCount: enrichedCart.length
      }
    });
  } catch (error) {
    next(error);
  }
};

export const addToCart = (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Check if product exists
    const product = db.getProductById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check stock
    const cartItems = db.getCartByUser(req.user.id);
    const existingItem = cartItems.find(item => item.productId === productId);
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    
    if (product.stock < currentQuantity + quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    const cartItem = {
      id: `cart-${Date.now()}`,
      userId: req.user.id,
      productId,
      quantity: parseInt(quantity),
      addedAt: new Date().toISOString()
    };

    db.addToCart(cartItem);

    res.status(201).json({
      success: true,
      message: 'Item added to cart',
      data: cartItem
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    // Check if product exists
    const product = db.getProductById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    const updatedItem = db.updateCartItem(req.user.id, productId, parseInt(quantity));

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    res.json({
      success: true,
      message: 'Cart item updated',
      data: updatedItem
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = (req, res, next) => {
  try {
    const { productId } = req.params;

    const removedItem = db.removeFromCart(req.user.id, productId);

    if (!removedItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    res.json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    next(error);
  }
};

export const clearCart = (req, res, next) => {
  try {
    db.clearCart(req.user.id);

    res.json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (error) {
    next(error);
  }
};

