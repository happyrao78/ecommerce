// routes/discountRoutes.js

import express from 'express';
import { 
  getAllDiscountCoupons, 
  getDiscountCouponById, 
  createDiscountCoupon,
  updateDiscountCoupon,
  deleteDiscountCoupon,
  validateCoupon
} from '../controllers/discount.controller.js';

const discountRouter = express.Router();

discountRouter
  .route('/')
  .get(getAllDiscountCoupons)
  .post(createDiscountCoupon);

discountRouter
  .route('/:id')
  .get(getDiscountCouponById)
  .put(updateDiscountCoupon)
  .delete(deleteDiscountCoupon);

discountRouter
  .route('/validate')
  .post(validateCoupon);

export default discountRouter;