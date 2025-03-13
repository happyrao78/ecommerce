import mongoose from "mongoose";

const discountCouponSchema = new mongoose.Schema({
    code: { 
        type: String, 
        required: true, 
        unique: true,
        uppercase: true,
        trim: true
    },
    description: { 
        type: String, 
        required: false 
    },
    discountType: { 
        type: String, 
        enum: ['percentage', 'fixed'], 
        default: 'percentage',
        required: true 
    },
    discountValue: { 
        type: Number, 
        required: true,
        min: 0,
        max: 100 // Max 100% for percentage discount
    },
    minOrderAmount: { 
        type: Number, 
        default: 0,
        required: false 
    },
    maxDiscountAmount: { 
        type: Number, 
        required: false 
    },
    startDate: { 
        type: Date, 
        default: Date.now 
    },
    endDate: { 
        type: Date,
        required: true
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    usageLimit: { 
        type: Number, 
        default: null // null means unlimited
    },
    currentUsage: { 
        type: Number, 
        default: 0 
    },
    perUserLimit: { 
        type: Number, 
        default: null // null means unlimited per user
    },
    userRestrictions: {
        type: [String], // Array of user IDs who can use this coupon
        default: [] // Empty array means no restrictions
    },
    productRestrictions: {
        type: [String], // Array of product IDs the coupon applies to
        default: [] // Empty array means no restrictions
    },
    categoryRestrictions: {
        type: [String], // Array of category IDs the coupon applies to
        default: [] // Empty array means no restrictions
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

// Index for faster lookup
discountCouponSchema.index({ code: 1 });
discountCouponSchema.index({ isActive: 1 });
discountCouponSchema.index({ startDate: 1, endDate: 1 });

const DiscountCoupon = mongoose.models.discountcoupon || mongoose.model("discountcoupon", discountCouponSchema);

export default DiscountCoupon;