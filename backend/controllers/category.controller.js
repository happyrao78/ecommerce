import Category from "../models/category.model.js";

const addCategory = async (req, res) => {
    try {
        const { category } = req.body;
        const categoryExists = await Category.findOne({ name: category });
        
        if (categoryExists) {
            return res.json({ success: false, message: "Category already exists" });
        }
        
        const newCategory = new Category({
            name: category,
            subcategories: []
        });
        
        await newCategory.save();
        res.json({ success: true, message: "Category added" });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().select('name');
        const categoryNames = categories.map(cat => cat.name);
        res.json({ success: true, categories: categoryNames });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const editCategory = async (req, res) => {
    try {
        const { category, newCategory } = req.body;
        
        const result = await Category.updateOne(
            { name: category },
            { name: newCategory }
        );
        
        if (result.matchedCount === 0) {
            return res.json({ success: false, message: "Category does not exist" });
        }
        
        res.json({ success: true, message: "Category updated" });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const removeCategory = async (req, res) => {
    try {
        const { category } = req.body;
        
        const result = await Category.deleteOne({ name: category });
        
        if (result.deletedCount === 0) {
            return res.json({ success: false, message: "Category does not exist" });
        }
        
        res.json({ success: true, message: "Category and all associated subcategories removed" });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const addSubCategory = async (req, res) => {
    try {
        const { category, subCategory } = req.body;
        
        if (!category || !subCategory) {
            return res.json({ 
                success: false, 
                message: "Both category and subCategory are required" 
            });
        }
        
        // Check if parent category exists, create it if not
        let categoryDoc = await Category.findOne({ name: category });
        
        if (!categoryDoc) {
            categoryDoc = new Category({
                name: category,
                subcategories: []
            });
        }
        
        // Check if subcategory already exists
        if (categoryDoc.subcategories.includes(subCategory)) {
            return res.json({ 
                success: false, 
                message: "This subcategory already exists for this category" 
            });
        }
        
        // Add the subcategory to the array
        categoryDoc.subcategories.push(subCategory);
        await categoryDoc.save();
        
        res.json({ success: true, message: "Subcategory added successfully" });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const getSubCategories = async (req, res) => {
    try {
        const { category } = req.query;
        
        if (category) {
            // Get subcategories for a specific category
            const categoryDoc = await Category.findOne({ name: category });
            
            if (!categoryDoc) {
                return res.json({ success: false, message: "Category does not exist" });
            }
            
            return res.json({ success: true, category, subcategories: categoryDoc.subcategories });
        } else {
            // Get all categories with their subcategories
            const categories = await Category.find();
            
            const result = categories.map(cat => ({
                category: cat.name,
                subcategories: cat.subcategories
            }));
            
            res.json({ success: true, categories: result });
        }
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const editSubCategory = async (req, res) => {
    try {
        const { category, subCategory, newSubCategory } = req.body;
        
        const categoryDoc = await Category.findOne({ name: category });
        
        if (!categoryDoc) {
            return res.json({ success: false, message: "Category does not exist" });
        }
        
        const subCategoryIndex = categoryDoc.subcategories.indexOf(subCategory);
        
        if (subCategoryIndex === -1) {
            return res.json({ success: false, message: "Subcategory does not exist" });
        }
        
        // Replace the old subcategory with the new one
        categoryDoc.subcategories[subCategoryIndex] = newSubCategory;
        await categoryDoc.save();
        
        res.json({ success: true, message: "Subcategory updated" });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const removeSubCategory = async (req, res) => {
    try {
        const { category, subCategory } = req.body;
        
        const categoryDoc = await Category.findOne({ name: category });
        
        if (!categoryDoc) {
            return res.json({ success: false, message: "Category does not exist" });
        }
        
        const subCategoryIndex = categoryDoc.subcategories.indexOf(subCategory);
        
        if (subCategoryIndex === -1) {
            return res.json({ success: false, message: "Subcategory does not exist" });
        }
        
        // Remove the subcategory from the array
        categoryDoc.subcategories.splice(subCategoryIndex, 1);
        await categoryDoc.save();
        
        res.json({ success: true, message: "Subcategory removed" });
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addCategory, getCategories, addSubCategory, getSubCategories, editCategory, removeCategory, editSubCategory, removeSubCategory };