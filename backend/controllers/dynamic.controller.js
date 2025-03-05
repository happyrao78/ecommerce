import dynamicModel from "../models/dynamic.model.js";
import { v2 as cloudinary } from "cloudinary";

// Add dynamic component
const addDynamic = async (req, res) => {
    try {
        const { title, subtitle, redirectLink } = req.body;
        
        // Get images from request
        const image1 = req.files?.image1 && req.files.image1[0];
        const image2 = req.files?.image2 && req.files.image2[0]; // Fixed index
        
        // Filter out undefined images
        const images = [image1, image2].filter((item) => item != undefined);
        
        // Upload images to Cloudinary
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
                return result.secure_url;
            })
        );
        
        // Create dynamic component data
        const dynamicData = {
            title,
            subtitle,
            image: imagesUrl,
            redirectLink,
        };
        
        const dynamic = new dynamicModel(dynamicData);
        await dynamic.save();
        
        res.json({ success: true, message: "Dynamic component added successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all dynamic components
const getAllDynamics = async (req, res) => {
    try {
        const dynamics = await dynamicModel.find().sort({ createdAt: -1 });
        res.json({ success: true, dynamics });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get single dynamic component by ID
const getDynamicById = async (req, res) => {
    try {
        const { id } = req.params;
        const dynamic = await dynamicModel.findById(id);
        
        if (!dynamic) {
            return res.status(404).json({ success: false, message: "Dynamic component not found" });
        }
        
        res.json({ success: true, dynamic });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update dynamic component
const updateDynamic = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subtitle, redirectLink } = req.body;
        
        // Check if dynamic exists
        const dynamic = await dynamicModel.findById(id);
        if (!dynamic) {
            return res.status(404).json({ success: false, message: "Dynamic component not found" });
        }
        
        // Prepare update data
        const updateData = {
            title,
            subtitle,
            redirectLink
        };
        
        // Handle image uploads if provided
        if (req.files) {
            const image1 = req.files?.image1 && req.files.image1[0];
            const image2 = req.files?.image2 && req.files.image2[0];
            
            const images = [image1, image2].filter((item) => item != undefined);
            
            if (images.length > 0) {
                // Upload new images to Cloudinary
                let imagesUrl = await Promise.all(
                    images.map(async (item) => {
                        let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
                        return result.secure_url;
                    })
                );
                
                // Combine with existing images or replace them
                updateData.image = imagesUrl;
            }
        }
        
        // Update the dynamic component
        await dynamicModel.findByIdAndUpdate(id, updateData);
        
        res.json({ success: true, message: "Dynamic component updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete dynamic component
const deleteDynamic = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if dynamic exists
        const dynamic = await dynamicModel.findById(id);
        if (!dynamic) {
            return res.status(404).json({ success: false, message: "Dynamic component not found" });
        }
        
        // Delete the dynamic component
        await dynamicModel.findByIdAndDelete(id);
        
        res.json({ success: true, message: "Dynamic component deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};




export {
    addDynamic,
    getAllDynamics,
    getDynamicById,
    updateDynamic,
    deleteDynamic,
    
};