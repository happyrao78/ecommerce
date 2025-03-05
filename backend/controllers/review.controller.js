import reviewModel from "../models/reviews.model.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import {v2 as cloudinary} from "cloudinary";

const addReview = async (req, res) => {
    try {
        const { id } = req.params; // Product ID
        const { rating, comment } = req.body;
        const userId = req.user.id;

        // Retrieve user details from userModel
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const name = user.name; // Extract user's name
        const image1 = req.files?.image1 && req.files.image1[0];
        const image2 = req.files?.image2 && req.files.image2[0];
        const video = req.files?.video && req.files.video[0];
        const images = [image1, image2].filter((item) => item != undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" })
                return result.secure_url
            })
        )
        // Handle image uploads if any
        const videos = [video].filter(Boolean);
        let videoUrl = await Promise.all(
            videos.map(async (item) => {
                const videoResult = await cloudinary.uploader.upload(video.path, { resource_type: "video" })
                return videoResult.secure_url;
            })
        )

        // Add review to the product
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const review = new reviewModel({ userId, name, rating, comment, images: imagesUrl, videos: [videoUrl].filter(Boolean) });
        await review.save();
        console.log(review);

        product.reviews.push(review);

        await product.save();
        res.status(200).json({ message: "Review added successfully", review });
    } catch (error) {
        res.status(500).json({ message: "Error adding review", error: error.message });
    }
};

// Get reviews for a product
const getReviews = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await productModel.findById(id).populate("reviews");

        if (!product) {
            return res.status(404).json({ message: "No reviews added yet" });
        }

        res.status(200).json(product.reviews);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reviews", error });
    }
};

export { addReview, getReviews };