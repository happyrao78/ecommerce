import attributeModel from "../models/attribute.model.js";
import productModel from "../models/productModel.js";

// Add a new attribute
const addAttribute = async (req, res) => {
    try {
        const { attributeName, attributeValues } = req.body;
        
        // Validate input
        if (!attributeName) {
            return res.json({ success: false, message: "Attribute name is required" });
        }
        
        // Check if attribute already exists
        const existingAttribute = await attributeModel.findOne({ attributeName });
        if (existingAttribute) {
            return res.json({ success: false, message: "Attribute with this name already exists" });
        }
        
        // Create new attribute
        const attribute = new attributeModel({
            attributeName,
            attributeValues: attributeValues || []
        });
        
        await attribute.save();
        
        res.json({ success: true, message: "Attribute added successfully", attribute });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// List all attributes
const listAttributes = async (req, res) => {
    try {
        const attributes = await attributeModel.find({});
        res.json({ success: true, attributes });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get single attribute by ID
const singleAttribute = async (req, res) => {
    try {
        const { attributeId } = req.body;
        
        if (!attributeId) {
            return res.json({ success: false, message: "Attribute ID is required" });
        }
        
        const attribute = await attributeModel.findById(attributeId);
        
        if (!attribute) {
            return res.json({ success: false, message: "Attribute not found" });
        }
        
        res.json({ success: true, attribute });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update an attribute
const updateAttribute = async (req, res) => {
    try {
        const { attributeId, attributeName, attributeValues } = req.body;
        
        if (!attributeId) {
            return res.json({ success: false, message: "Attribute ID is required" });
        }
        
        // Check if attribute exists
        const attribute = await attributeModel.findById(attributeId);
        if (!attribute) {
            return res.json({ success: false, message: "Attribute not found" });
        }
        
        // Check if new name already exists (if name is being changed)
        if (attributeName && attributeName !== attribute.attributeName) {
            const existingAttribute = await attributeModel.findOne({ attributeName });
            if (existingAttribute) {
                return res.json({ success: false, message: "Another attribute with this name already exists" });
            }
        }
        
        // Prepare update data
        const updateData = {};
        if (attributeName) updateData.attributeName = attributeName;
        if (attributeValues) updateData.attributeValues = attributeValues;
        
        // Update the attribute
        const updatedAttribute = await attributeModel.findByIdAndUpdate(
            attributeId,
            updateData,
            { new: true }
        );
        
        res.json({ 
            success: true, 
            message: "Attribute updated successfully", 
            attribute: updatedAttribute 
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Delete an attribute
const deleteAttribute = async (req, res) => {
    try {
        const { attributeId } = req.body;
        
        if (!attributeId) {
            return res.json({ success: false, message: "Attribute ID is required" });
        }
        
        // Check if attribute exists
        const attribute = await attributeModel.findById(attributeId);
        if (!attribute) {
            return res.json({ success: false, message: "Attribute not found" });
        }
        
        // Check if attribute is used in any products
        const productsWithAttribute = await productModel.find({ 
            attributes: attributeId 
        });
        
        if (productsWithAttribute.length > 0) {
            return res.json({ 
                success: false, 
                message: `Cannot delete attribute. It is used in ${productsWithAttribute.length} products`,
                products: productsWithAttribute.map(p => ({ id: p._id, name: p.name }))
            });
        }
        
        // Delete the attribute
        await attributeModel.findByIdAndDelete(attributeId);
        
        res.json({ success: true, message: "Attribute deleted successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Add a new value to an attribute
const addAttributeValue = async (req, res) => {
    try {
        const { attributeId, value } = req.body;
        
        if (!attributeId || !value) {
            return res.json({ success: false, message: "Attribute ID and value are required" });
        }
        
        // Check if attribute exists
        const attribute = await attributeModel.findById(attributeId);
        if (!attribute) {
            return res.json({ success: false, message: "Attribute not found" });
        }
        
        // Check if value already exists
        if (attribute.attributeValues.includes(value)) {
            return res.json({ success: false, message: "Value already exists in this attribute" });
        }
        
        // Add the new value
        attribute.attributeValues.push(value);
        await attribute.save();
        
        res.json({ 
            success: true, 
            message: "Value added to attribute successfully", 
            attribute 
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Remove a value from an attribute
const removeAttributeValue = async (req, res) => {
    try {
        const { attributeId, value } = req.body;
        
        if (!attributeId || !value) {
            return res.json({ success: false, message: "Attribute ID and value are required" });
        }
        
        // Check if attribute exists
        const attribute = await attributeModel.findById(attributeId);
        if (!attribute) {
            return res.json({ success: false, message: "Attribute not found" });
        }
        
        // Check if value exists
        if (!attribute.attributeValues.includes(value)) {
            return res.json({ success: false, message: "Value not found in this attribute" });
        }
        
        // Remove the value
        attribute.attributeValues = attribute.attributeValues.filter(v => v !== value);
        await attribute.save();
        
        res.json({ 
            success: true, 
            message: "Value removed from attribute successfully", 
            attribute 
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const editAttributeValue = async (req, res) => {
    try {
        const { attributeId, value, newValue } = req.body;
        
        if (!attributeId || !value || !newValue) {
            return res.json({ success: false, message: "Attribute ID, value, and new value are required" });
        }
        
        // Check if attribute exists
        const attribute = await attributeModel.findById(attributeId);
        if (!attribute) {
            return res.json({ success: false, message: "Attribute not found" });
        }

        // Check if value exists
        if (!attribute.attributeValues.includes(value)) {
            return res.json({ success: false, message: "Value not found in this attribute" });
        }

        // Check if new value already exists
        if (attribute.attributeValues.includes(newValue)) {
            return res.json({ success: false, message: "New value already exists in this attribute" });
        }
        
        // Edit the value
        attribute.attributeValues = attribute.attributeValues.map(v => v === value ? newValue : v);
        await attribute.save();

        res.json({
            success: true,
            message: "Value edited successfully",
            attribute
        });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}

export { 
    addAttribute, 
    listAttributes, 
    singleAttribute, 
    updateAttribute, 
    deleteAttribute,
    addAttributeValue,
    removeAttributeValue,
    editAttributeValue
};