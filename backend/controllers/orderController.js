//Placing orders using COD

// import { currency } from "../../admin/src/App.jsx"
import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import Stripe from "stripe"
import razorpay from "razorpay"
import mongoose from "mongoose"

// global variables
const currency = "inr"
const deliveryCharge = 10

//gateway intialissation
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY) 
const razorpayInstance = new razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET,
})

const placeOrder = async(req,res)=>{
    try {
        const {userId,items,amount,originalAmount,discountAmount,couponCode,address,conversionRate,currency}= req.body

    const orderData = {
        userId,
        items,
        address,
        amount : (originalAmount - discountAmount)*conversionRate,
        originalAmount : originalAmount*conversionRate || amount ,
        discountAmount : discountAmount*conversionRate || 0,
        couponCode : couponCode || "",
        paymentMethod:"COD",
        payment:false,
        date:Date.now()
    }

    const newOrder = new orderModel(orderData)
    await newOrder.save()

    await userModel.findByIdAndUpdate(userId,{cartData:{}})

    res.json({success:true,message:"Order Placed"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
        
    }
    
}

//Placing orders using Stripe

const placeOrderStripe = async(req,res)=>{
    try {
        const {userId,items,amount,address}= req.body
        const {origin} = req.headers

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"Stripe",
            payment:false,
            date:Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        console.log(items);
        
        

        const line_items = items.map((item) => ({
            price_data: {
                currency: currency, // Ensure 'currency' is defined
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100, // Stripe expects the price in cents
            },
            quantity: item.quantity, // 'quantity' is a top-level property
        }));
        
        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charges",
                },
                unit_amount: deliveryCharge * 100, // Same here
            },
            quantity: 1, // Also a top-level property
        });
        
       
        
        
        const session = await stripe.checkout.sessions.create({
            success_url:`${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:`${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode:"payment"

        })

        res.json({success:true,session_url:session.url})


    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }

}
// verify stripe
const verifyStripe = async(req,res)=>{
    const {orderId,success,userId}=req.body
    try {
        if(success==="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true})
            await userModel.findByIdAndUpdate(userId,{cartData:{}})
            res.json({success:true})
        }else{
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}



//Placing orders using Razorpay

const placeOrderRazorpay = async(req,res)=>{
    try {

        const {userId,items,amount,address,currency,conversionRate}= req.body
        // const {origin} = req.headers

        const orderData = {
            userId,
            items,
            address,
            amount:Number(amount.toFixed(2)),
            paymentMethod:"Razorpay",
            payment:false,
            date:Date.now(),
            currency,
            conversionRate
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const options = {
            amount:amount*100,
            currency:currency.toUpperCase(),
            receipt:newOrder._id.toString()
        }

        await razorpayInstance.orders.create(options,(error,order)=>{
            if (error) {
                console.log(error);
                return res.json({success:false,message:error})
            }
            res.json({success:true,order})
        })

        
        
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
        
    }
}

const verifyRazorpay =async(req,res)=>{
    try {
        const {userId,razorpay_order_id} = req.body
        // console.log(req.body)
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        // console.log(orderInfo);

        if(orderInfo.status=="paid"){
            await orderModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
            await userModel.findByIdAndUpdate(userId,{cartData:{}})
            res.json({success:true,message:"Payment Successful"})
        }else{
            res.json({success:false,message:"Payment Failed"})
        }


        
    } catch (error) {
        console.log("Payment failed", error);
        res.json({success:false,message:error.message})
    }
}

//all orders data for admin panel
const allOrders = async(req,res)=>{
    try {
        const orders = await orderModel.find({})
        res.json({success:true,orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

const recentOrders = async(req,res)=>{
    try {
        const orders = await orderModel.find({status: "Order Placed"}).sort({_id:-1}).limit(500)
        res.json({success:true,orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}


//User orders data for admin panel
const userOrders = async(req,res)=>{
    try {
        const {userId}=req.body 
        console.log("ENtered userorders")

        const orders = await orderModel.find({userId})
        console.log(orders)
        res.json({success:true,orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
        
    }

    
}

// add tracking link to order
const addTrackingLink = async(req, res) => {
    try {
        const { orderId, trackingLink } = req.body

        // Validate input
        if (!orderId || !trackingLink) {
            return res.json({
                success: false, 
                message: "Order ID and Tracking Link are required"
            })
        }

        // Update the order with tracking link
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId, 
            { trackingLink }, 
            { new: true }
        )

        if (!updatedOrder) {
            return res.json({
                success: false, 
                message: "Order not found"
            })
        }

        res.json({
            success: true, 
            message: "Tracking link added successfully",
            order: updatedOrder
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false, 
            message: error.message
        })
    }
}


// Modified updateStatus to handle "Completed" status
const updateStatus = async(req, res) => {
    try {
        const { orderId, status } = req.body

        // Find the current order
        const currentOrder = await orderModel.findById(orderId)

        if (!currentOrder) {
            return res.json({
                success: false, 
                message: "Order not found"
            })
        }

        // Special handling for "Completed" status
        if (status === "Completed") {
            // If payment is pending, mark it as paid
            const updateData = {
                status: "Completed",
                payment: true
            }
            
            await orderModel.findByIdAndUpdate(orderId, updateData)

            res.json({
                success: true, 
                message: "Order completed and payment confirmed"
            })
        }
        else if (status === "Cancelled" && currentOrder.paymentMethod === "COD"){
            const reupdateData = {
                status : "Cancelled",
                payment : false
            }

            await orderModel.findByIdAndUpdate(orderId, reupdateData)
            res.json({
                success: true,
                message : "Order Cancelled and Payment status updated"
            })
        }
        else {
            // Regular status update
            await orderModel.findByIdAndUpdate(orderId, { status })

            res.json({
                success: true, 
                message: "Status Updated"
            })
        }
    } catch (error) {
        console.log(error);
        res.json({
            success: false, 
            message: error.message
        })
    }
}

const getMonthlyOrderTotal = async (req, res) => {
    try {
        const monthlyTotals = await orderModel.aggregate([
            // Ensure date is converted to a proper date object
            {
                $addFields: {
                    convertedDate: { 
                        $toDate: "$date" 
                    }
                }
            },
            // Match only completed orders
            { $match: { 
                status: { 
                    $in: ["Order Placed","Accepted", "Completed"] 
                } 
            } },
            // Extract month from the converted date
            { 
                $addFields: { 
                    month: { 
                        $dateToParts: { 
                            date: "$convertedDate" 
                        } 
                    } 
                } 
            },
            // Group by month and calculate total
            {
                $group: {
                    _id: {
                        month: "$month.month",
                        year: "$month.year"
                    },
                    total: { $sum: "$amount" }
                }
            },
            // Sort by year and month
            { 
                $sort: { 
                    "_id.year": 1,
                    "_id.month": 1
                } 
            },
            // Map month numbers to names
            {
                $project: {
                    _id: 0,
                    month: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$_id.month", 1] }, then: "January" },
                                { case: { $eq: ["$_id.month", 2] }, then: "February" },
                                { case: { $eq: ["$_id.month", 3] }, then: "March" },
                                { case: { $eq: ["$_id.month", 4] }, then: "April" },
                                { case: { $eq: ["$_id.month", 5] }, then: "May" },
                                { case: { $eq: ["$_id.month", 6] }, then: "June" },
                                { case: { $eq: ["$_id.month", 7] }, then: "July" },
                                { case: { $eq: ["$_id.month", 8] }, then: "August" },
                                { case: { $eq: ["$_id.month", 9] }, then: "September" },
                                { case: { $eq: ["$_id.month", 10] }, then: "October" },
                                { case: { $eq: ["$_id.month", 11] }, then: "November" },
                                { case: { $eq: ["$_id.month", 12] }, then: "December" }
                            ],
                            default: "Unknown"
                        }
                    },
                    total: "$total"
                }
            }
        ])

        res.json({ 
            success: true, 
            monthlyTotals 
        })
    } catch (error) {
        console.error("Monthly Order Total Error:", error)
        res.status(500).json({ 
            success: false, 
            message: error.message 
        })
    }
}

// Updated method for completed revenue
const getCompletedRevenue = async (req, res) => {
    try {
        const monthlyRevenue = await orderModel.aggregate([
            // Ensure date is converted to a proper date object
            {
                $addFields: {
                    convertedDate: { 
                        $toDate: "$date" 
                    }
                }
            },
            // Match only completed orders with payment
            { $match: { 
                status: "Completed", 
                payment: true 
            } },
            // Extract month from the converted date
            { 
                $addFields: { 
                    month: { 
                        $dateToParts: { 
                            date: "$convertedDate" 
                        } 
                    } 
                } 
            },
            // Group by month and calculate revenue
            {
                $group: {
                    _id: {
                        month: "$month.month",
                        year: "$month.year"
                    },
                    revenue: { $sum: "$amount" }
                }
            },
            // Sort by year and month
            { 
                $sort: { 
                    "_id.year": 1,
                    "_id.month": 1
                } 
            },
            // Map month numbers to names
            {
                $project: {
                    _id: 0,
                    month: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$_id.month", 1] }, then: "January" },
                                { case: { $eq: ["$_id.month", 2] }, then: "February" },
                                { case: { $eq: ["$_id.month", 3] }, then: "March" },
                                { case: { $eq: ["$_id.month", 4] }, then: "April" },
                                { case: { $eq: ["$_id.month", 5] }, then: "May" },
                                { case: { $eq: ["$_id.month", 6] }, then: "June" },
                                { case: { $eq: ["$_id.month", 7] }, then: "July" },
                                { case: { $eq: ["$_id.month", 8] }, then: "August" },
                                { case: { $eq: ["$_id.month", 9] }, then: "September" },
                                { case: { $eq: ["$_id.month", 10] }, then: "October" },
                                { case: { $eq: ["$_id.month", 11] }, then: "November" },
                                { case: { $eq: ["$_id.month", 12] }, then: "December" }
                            ],
                            default: "Unknown"
                        }
                    },
                    revenue: "$revenue"
                }
            }
        ])

        res.json({ 
            success: true, 
            monthlyRevenue 
        })
    } catch (error) {
        console.error("Completed Revenue Error:", error)
        res.status(500).json({ 
            success: false, 
            message: error.message 
        })
    }
}




export {placeOrder,placeOrderStripe,placeOrderRazorpay,allOrders,userOrders,updateStatus,verifyStripe,verifyRazorpay,addTrackingLink,
    getMonthlyOrderTotal, getCompletedRevenue, recentOrders 
};