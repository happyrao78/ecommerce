import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    name: { type: String, required: true }, // Name of the reviewer
    rating: { type: Number, required: true, min: 1, max: 5 }, // Rating out of 5
    comment: { type: String, required: true }, // Review text
    images: { type: Array }, // Optional review images
    videos: { type: Array }, // Optional review videos
    // date: { type: Date, default: Date.now } // Timestamp
},{
    timestamps:true
});

const reviewModel = mongoose.models.review || mongoose.model("review", reviewSchema);

export default reviewModel;