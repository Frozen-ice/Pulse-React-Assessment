import db from '../config/database.js';

export const getOrderById = (req, res, next) => {
  try {
    const order = db.getOrderById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order or is admin
    const user = db.getUserById(req.user.id);
    if (order.userId !== req.user.id && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this order'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};
export const getOrders = (req, res, next) => {
  try {
    const user = db.getUserById(req.user.id);
    let orders;

    // Admin can see all orders, users see only their own
    if (user.role === 'admin') {
      orders = db.getOrders();
    } else {
      orders = db.getOrdersByUser(req.user.id);
    }
    // get order from blog
    db.getOrder();
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};
export const createOrder = (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = db.getProductById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
        name: product.name
      });

      // Update product stock
      db.updateProduct(product.id, {
        stock: product.stock - item.quantity
      });
    }

    const tax = subtotal * 0.08; // 8% tax
    const shipping = 15.99; // Fixed shipping
    const total = subtotal + tax + shipping;

    const order = {
      id: `order-${Date.now()}`,
      userId: req.user.id,
      items: orderItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      status: 'pending',
      shippingAddress: shippingAddress || req.user.address,
      paymentMethod: paymentMethod || 'credit_card',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString()
    };

    db.createOrder(order);

    // Clear user's cart
    db.clearCart(req.user.id);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status'
      });
    }

    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Only admin or seller can update order status
    const user = db.getUserById(req.user.id);
    if (user.role !== 'admin' && user.role !== 'seller') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update order status'
      });
    }

    const updates = { status };
    if (status === 'shipped') {
      updates.shippedAt = new Date().toISOString();
    }
    if (status === 'delivered') {
      updates.deliveredAt = new Date().toISOString();
      updates.paymentStatus = 'paid';
    }

    const updatedOrder = db.updateOrder(req.params.id, updates);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

