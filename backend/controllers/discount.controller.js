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