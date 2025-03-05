import express from "express";
import { addReview, getReviews } from "../controllers/review.controller.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const reviewRouter = express.Router();

reviewRouter.post("/:id/add-review", authUser, upload.fields([
    { name: "image1", maxCount: 1 }, { name: "image2", maxCount: 1 },
    { name: "video", maxCount: 1 }]), addReview); // Add review to a product

reviewRouter.get("/:id/get-review", authUser, getReviews); // Get reviews for a product

export default reviewRouter;