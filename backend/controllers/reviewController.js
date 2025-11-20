import db from '../config/database.js';
import axios from 'axios';
export const getReviews = (req, res, next) => {
  try {
    const { productId, userId } = req.query;
    let reviews;

    if (productId) {
      reviews = db.getReviewsByProduct(productId);
    } else if (userId) {
      reviews = db.getReviewsByUser(userId);
    } else {
      reviews = db.getReviews();
    }

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

export const getReviewById = (req, res, next) => {
  try {
    const review = db.getReviewById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

export const createReview = (req, res, next) => {
  try {
    const { productId, rating, title, comment } = req.body;

    // Check if product exists
    const product = db.getProductById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user has already reviewed this product
    const existingReview = db.getReviewsByProduct(productId)
      .find(r => r.userId === req.user.id);
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Check if user has purchased this product (for verified purchase)
    const userOrders = db.getOrdersByUser(req.user.id);
    const hasPurchased = userOrders.some(order => 
      order.items.some(item => item.productId === productId) &&
      order.status === 'delivered'
    );

    const review = {
      id: `review-${Date.now()}`,
      productId,
      userId: req.user.id,
      rating: parseInt(rating),
      title,
      comment,
      verifiedPurchase: hasPurchased,
      createdAt: new Date().toISOString()
    };

    db.createReview(review);

    // Update product rating
    const productReviews = db.getReviewsByProduct(productId);
    const averageRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
    db.updateProduct(productId, {
      rating: parseFloat(averageRating.toFixed(1)),
      reviewCount: productReviews.length
    });

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

export const updateReview = (req, res, next) => {
  try {
    const review = db.getReviewById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this review'
      });
    }

    const updatedReview = db.updateReview(req.params.id, req.body);

    // Update product rating if rating changed
    if (req.body.rating) {
      const productReviews = db.getReviewsByProduct(review.productId);
      const averageRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
      db.updateProduct(review.productId, {
        rating: parseFloat(averageRating.toFixed(1))
      });
    }

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: updatedReview
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = (req, res, next) => {
  try {
    const review = db.getReviewById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review or is admin
    const user = db.getUserById(req.user.id);
    if (review.userId !== req.user.id && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this review'
      });
    }

    db.deleteReview(req.params.id);

    // Update product rating
    const productReviews = db.getReviewsByProduct(review.productId);
    if (productReviews.length > 0) {
      const averageRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
      db.updateProduct(review.productId, {
        rating: parseFloat(averageRating.toFixed(1)),
        reviewCount: productReviews.length
      });
    } else {
      db.updateProduct(review.productId, {
        rating: 0,
        reviewCount: 0
      });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};