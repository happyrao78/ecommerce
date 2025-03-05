// // add products to user wishlist
// import userModel from "../models/userModel.js";

// // Add to wishlist
// const addToWishlist = async (req, res) => {
//     try {
//         const { userId, itemId } = req.body;
        
//         // Fetch user data from the database
//         const userData = await userModel.findById(userId);
//         let wishlistData = userData.wishlistData || {}; // Ensure wishlistData exists
        
//         // Add item to wishlist (with a value of 1 to indicate it exists)
//         wishlistData[itemId] = 1;
        
//         // Update the wishlist data in the database
//         await userModel.findByIdAndUpdate(userId, { wishlistData });
//         const updatedData = await userModel.findById(userId);
//         console.log(updatedData);
        
//         res.json({ success: true, message: "Added to Wishlist" });
//     } catch (error) {
//         console.error(error);
//         res.json({ success: false, message: error.message });
//     }
// };

// // Remove from wishlist
// const removeFromWishlist = async (req, res) => {
//     try {
//         const { userId, itemId } = req.body;
//         const userData = await userModel.findById(userId);
//         let wishlistData = userData.wishlistData || {};
        
//         // Remove item from wishlist
//         if (wishlistData[itemId]) {
//             delete wishlistData[itemId];
//         }
        
//         // Update the wishlist data in the database
//         await userModel.findByIdAndUpdate(userId, { wishlistData });
        
//         res.json({ success: true, message: "Removed from Wishlist" });
//     } catch (error) {
//         console.error(error);
//         res.json({ success: false, message: error.message });
//     }
// };

// // Move item from wishlist to cart
// const moveToCart = async (req, res) => {
//     try {
//         const { userId, itemId } = req.body;
//         const userData = await userModel.findById(userId);
//         let wishlistData = userData.wishlistData || {};
//         let cartData = userData.cartData || {};
        
//         // Check if item exists in wishlist
//         if (wishlistData[itemId]) {
//             // Add to cart
//             if (cartData[itemId]) {
//                 cartData[itemId] += 1; // Increment if already in cart
//             } else {
//                 cartData[itemId] = 1; // Add to cart with quantity 1
//             }
            
//             // Remove from wishlist
//             delete wishlistData[itemId];
            
//             // Update both wishlist and cart data
//             await userModel.findByIdAndUpdate(userId, { wishlistData, cartData });
            
//             res.json({ success: true, message: "Moved to Cart" });
//         } else {
//             res.json({ success: false, message: "Item not found in wishlist" });
//         }
//     } catch (error) {
//         console.error(error);
//         res.json({ success: false, message: error.message });
//     }
// };

// // Get user wishlist
// const getUserWishlist = async (req, res) => {
//     try {
//         const { userId } = req.body;
//         const userData = await userModel.findById(userId);
//         let wishlistData = userData.wishlistData || {};
        
//         res.json({ success: true, wishlistData: wishlistData });
//     } catch (error) {
//         console.error(error);
//         res.json({ success: false, message: error.message });
//     }
// };

// // Clear entire wishlist
// const clearWishlist = async (req, res) => {
//     try {
//         const { userId } = req.body;
        
//         // Update with empty wishlist data
//         await userModel.findByIdAndUpdate(userId, { wishlistData: {} });
        
//         res.json({ success: true, message: "Wishlist Cleared" });
//     } catch (error) {
//         console.error(error);
//         res.json({ success: false, message: error.message });
//     }
// };

// export { 
//     addToWishlist, 
//     removeFromWishlist, 
//     getUserWishlist, 
//     moveToCart,
//     clearWishlist 
// };



import userModel from "../models/userModel.js";

// Add to wishlist
const addToWishlist = async (req, res) => {
    try {
        const { userId, itemId, selectedAttributeValues } = req.body;
        if (!userId || !itemId) return res.status(400).json({ success: false, message: "Missing userId or itemId" });

        const userData = await userModel.findById(userId);
        if (!userData) return res.status(404).json({ success: false, message: "User not found" });

        let wishlistData = userData.wishlistData || {};
        const attributesKey = JSON.stringify(selectedAttributeValues || {});
        const wishlistItemKey = `${itemId}_${attributesKey}`;

        wishlistData[wishlistItemKey] = { itemId, attributes: selectedAttributeValues };
        await userModel.findByIdAndUpdate(userId, { wishlistData });

        res.json({ success: true, message: "Added to Wishlist" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Remove from wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const { userId, itemId, selectedAttributeValues } = req.body;
        if (!userId || !itemId) return res.status(400).json({ success: false, message: "Missing userId or itemId" });

        const userData = await userModel.findById(userId);
        if (!userData) return res.status(404).json({ success: false, message: "User not found" });

        let wishlistData = userData.wishlistData || {};
        const attributesKey = JSON.stringify(selectedAttributeValues || {});
        const wishlistItemKey = `${itemId}_${attributesKey}`;

        if (wishlistData[wishlistItemKey]) {
            delete wishlistData[wishlistItemKey];
            await userModel.findByIdAndUpdate(userId, { wishlistData });
        }

        res.json({ success: true, message: "Removed from Wishlist" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Move item from wishlist to cart
const moveToCart = async (req, res) => {
    try {
        const { userId, itemId, selectedAttributeValues } = req.body;
        if (!userId || !itemId) return res.status(400).json({ success: false, message: "Missing userId or itemId" });

        const userData = await userModel.findById(userId);
        if (!userData) return res.status(404).json({ success: false, message: "User not found" });

        let wishlistData = userData.wishlistData || {};
        let cartData = userData.cartData || {};
        const attributesKey = JSON.stringify(selectedAttributeValues || {});
        const wishlistItemKey = `${itemId}_${attributesKey}`;

        if (wishlistData[wishlistItemKey]) {
            cartData[wishlistItemKey] = { itemId, attributes: selectedAttributeValues, quantity: (cartData[wishlistItemKey]?.quantity || 0) + 1 };
            delete wishlistData[wishlistItemKey];
            await userModel.findByIdAndUpdate(userId, { wishlistData, cartData });
            res.json({ success: true, message: "Moved to Cart" });
        } else {
            res.status(404).json({ success: false, message: "Item not found in wishlist" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get user wishlist
const getUserWishlist = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ success: false, message: "Missing userId" });

        const userData = await userModel.findById(userId);
        if (!userData) return res.status(404).json({ success: false, message: "User not found" });

        res.json({ success: true, wishlistData: userData.wishlistData || {} });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Clear entire wishlist
const clearWishlist = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ success: false, message: "Missing userId" });

        await userModel.findByIdAndUpdate(userId, { wishlistData: {} });
        res.json({ success: true, message: "Wishlist Cleared" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { addToWishlist, removeFromWishlist, getUserWishlist, moveToCart, clearWishlist };