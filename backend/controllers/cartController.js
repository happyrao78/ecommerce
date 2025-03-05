// add products to user cart

import userModel from "../models/userModel.js";

// const addToCart  = async(req,res)=>{
//     try {
//         const{userId,itemId} = req.body;
//         const userData = await userModel.findById(userId)
//         let cartData =await userData.cartData;
//         if(cartData[itemId]){
//             if(cartData[itemId][size]){
//                 cartData[itemId][size]+=1
//             }else{
//                 cartData[itemId][size]=1
//             }
//         }else{
//             cartData[itemId]={}
//             cartData[itemId][size]=1
//         }

//         await userModel.findByIdAndUpdate(userId,{cartData})

//         res.json({success:true,message:"Added To Cart"})

//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:error.message})
        
//     }
// }

// update user cart

// const addToCart = async (req, res) => {
//     try {
//         const { userId, itemId, selectedAttributeValues } = req.body;

//         // Fetch user data from the database
//         const userData = await userModel.findById(userId);
//         let cartData = userData.cartData || {}; // Ensure cartData exists

//         // Check if the item already exists in the cart
//         if (cartData[itemId]) {
//             cartData[itemId].quantity += 1; // Increment the quantity
//         } else {
//             cartData[itemId] = {
//                 quantity: 1,
//                 attributes: selectedAttributeValues // Add the item with attributes
//             };
//         }

//         // Update the cart data in the database
//         await userModel.findByIdAndUpdate(userId, { cartData });

//         res.json({ success: true, message: "Added to Cart" });
//     } catch (error) {
//         console.error(error);
//         res.json({ success: false, message: error.message });
//     }
// };


const addToCart = async (req, res) => {
    try {
        const { userId, itemId, selectedAttributeValues } = req.body;
        
        // Fetch user data from the database
        const userData = await userModel.findById(userId);
        let cartData = userData.cartData || {}; // Ensure cartData exists
        
        // Create a unique key by combining itemId with attributes
        const attributesKey = JSON.stringify(selectedAttributeValues || {});
        const cartItemKey = `${itemId}_${attributesKey}`;
        
        // Check if the exact item with these attributes exists in the cart
        if (cartData[cartItemKey]) {
            cartData[cartItemKey].quantity += 1; // Increment the quantity
        } else {
            cartData[cartItemKey] = {
                itemId, // Store the original itemId for reference
                quantity: 1,
                attributes: selectedAttributeValues // Add the item with attributes
            };
        }
        
        // Update the cart data in the database
        await userModel.findByIdAndUpdate(userId, { cartData });
        
        res.json({ success: true, message: "Added to Cart" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};




// const updateCart  = async(req,res)=>{
//     try {
//         const {userId,itemId,quantity} = req.body
//         const userData = await userModel.findById(userId)
//         let cartData =await userData.cartData;

//         cartData[itemId]=quantity

//         await userModel.findByIdAndUpdate(userId,{cartData})

//         res.json({success:true,message:"Cart Updated"})

//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:error.message})
//     }
// }

// // get user cart

// const getUserCart  = async(req,res)=>{
//     try {
//         const {userId}=req.body
//         const userData = await userModel.findById(userId)
//         let cartData =await userData.cartData;
//         res.json({success:true,cartData:cartData})

//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:error.message})
//     }
// }

const updateCart = async (req, res) => {
    try {
        const { userId, itemId, quantity, selectedAttributeValues } = req.body;

        // Fetch user data from the database
        const userData = await userModel.findById(userId);
        let cartData = userData.cartData || {}; // Ensure cartData exists

        // Create the same composite key as used in addToCart
        const attributesKey = JSON.stringify(selectedAttributeValues || {});
        const cartItemKey = `${itemId}_${attributesKey}`;

        // Check if the item exists in the cart before updating
        if (cartData[cartItemKey]) {
            cartData[cartItemKey].quantity = quantity;

            // If `selectedAttributeValues` is provided, update attributes as well
            if (selectedAttributeValues) {
                cartData[cartItemKey].attributes = selectedAttributeValues;
            }
        } else {
            return res.json({ success: false, message: "Item not found in cart" });
        }

        // Update the cart data in the database
        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Cart Updated" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;
        
        // Fetch user data
        const userData = await userModel.findById(userId);
        
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData || {}; // Ensure cartData exists

        // Optional: transform the cart data to a more client-friendly format
        const formattedCart = Object.entries(cartData).map(([key, item]) => {
            const [itemId, attributesString] = key.split('_');
            return {
                cartItemKey: key,
                itemId,
                quantity: item.quantity,
                attributes: item.attributes
            };
        });

        res.json({ 
            success: true, 
            cartData,
            formattedCart // Include the formatted version for easier client-side handling
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

export { addToCart, updateCart, getUserCart };



