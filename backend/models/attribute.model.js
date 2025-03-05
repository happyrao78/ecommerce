import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema(
    {
        attributeName: {
            type: String,
            required: true,
            unique: true
        },
        attributeValues: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true,
    }
);

const attributeModel = mongoose.model("attribute", attributeSchema);

export default attributeModel;