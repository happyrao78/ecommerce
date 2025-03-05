import express from "express"
import { addToWishlist,getUserWishlist} from "../controllers/wishlistController.js"
import authUser from "../middleware/auth.js";
import { removeFromWishlist } from "../controllers/wishlistController.js";
import { moveToCart } from "../controllers/wishlistController.js";
import { clearWishlist } from "../controllers/wishlistController.js";

const wishlistRouter = express.Router();

wishlistRouter.post("/get", authUser, getUserWishlist);

// Add item to wishlist
wishlistRouter.post("/add", authUser, addToWishlist);

// Remove item from wishlist
wishlistRouter.post("/remove", authUser, removeFromWishlist);

// Move item from wishlist to cart
wishlistRouter.post("/move-to-cart", authUser, moveToCart);

// Clear entire wishlist
wishlistRouter.post("/clear", authUser, clearWishlist);

export default wishlistRouter