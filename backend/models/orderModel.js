import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount:{type:Number, required :true},
    address:{type: Object,required:true},
    status:{type:String,required:true,default:"Order Placed"},
    paymentMethod:{type:String,required:true},
    payment:{type:Boolean,required:true,default:false},
    date:{type:Number,required:true},
    trackingLink: { type: String, default: null }, 
    originalAmount: {
    type: Number,
    required: false
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  couponCode: {
    type: String
  }

    

})

const orderModel = mongoose.models.ordernew || mongoose.model("ordernew",orderSchema)

export default orderModel;