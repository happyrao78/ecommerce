import DiscountCoupon from '../models/discountCoupon.model.js';

// Get all discount coupons
export const getAllDiscountCoupons = async (req, res) => {
  try {
    const discountCoupons = await DiscountCoupon.find();
    res.status(200).json({
      success: true,
      count: discountCoupons.length,
      data: discountCoupons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get single discount coupon
export const getDiscountCouponById = async (req, res) => {
  try {
    const discountCoupon = await DiscountCoupon.findById(req.params.id);
    
    if (!discountCoupon) {
      return res.status(404).json({
        success: false,
        error: 'Discount coupon not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: discountCoupon
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Create new discount coupon
export const createDiscountCoupon = async (req, res) => {
  try {
    const discountCoupon = await DiscountCoupon.create(req.body);
    
    res.status(201).json({
      success: true,
      data: discountCoupon
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else if (error.code === 11000) { // Duplicate key error (unique code violation)
      return res.status(400).json({
        success: false,
        error: 'Discount code already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// Update discount coupon
export const updateDiscountCoupon = async (req, res) => {
  try {
    const discountCoupon = await DiscountCoupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!discountCoupon) {
      return res.status(404).json({
        success: false,
        error: 'Discount coupon not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: discountCoupon
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Discount code already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// Delete discount coupon
export const deleteDiscountCoupon = async (req, res) => {
  try {
    const discountCoupon = await DiscountCoupon.findById(req.params.id);
    
    if (!discountCoupon) {
      return res.status(404).json({
        success: false,
        error: 'Discount coupon not found'
      });
    }
    
    await discountCoupon.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Add this to your discountCoupon.controller.js

// Validate coupon code
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a coupon code'
      });
    }
    
    // Find the coupon case-insensitive
    const coupon = await DiscountCoupon.findOne({
      code: { $regex: new RegExp('^' + code + '$', 'i') }
    });
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: 'Coupon not found'
      });
    }
    
    // Check if coupon is active
    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        error: 'This coupon is not active'
      });
    }
    
    // Check expiration date
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({
        success: false,
        error: 'This coupon has expired'
      });
    }
    
    // Check minimum purchase amount if set
    if (req.body.cartAmount && coupon.minOrderAmount && req.body.cartAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        error: `Minimum purchase of ${coupon.minOrderAmount} required`
      });
    }
    
    // Check usage limit per user if applicable
    // if (coupon.usageLimit) {
    //   // If you have user tracking for coupons, implement the check here
    //   // For example:
    //   // const usageCount = await CouponUsage.find({ couponId: coupon._id, userId: req.user.id }).count();
    //   // if (usageCount >= coupon.usageLimit) {
    //   //   return res.status(400).json({
    //   //     success: false,
    //   //     error: 'You have reached the usage limit for this coupon'
    //   //   });
    //   // }
    // }
    
    // Return coupon details if valid
    res.status(200).json({
      success: true,
      data: coupon
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};