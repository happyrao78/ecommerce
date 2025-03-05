import express from "express";
import upload from "../middleware/multer.js";
import { 
    addDynamic, 
    getAllDynamics, 
    getDynamicById, 
    updateDynamic, 
    deleteDynamic ,
    
} from "../controllers/dynamic.controller.js";
// import { verifyToken } from "../middleware/auth.js"; // Assuming you have this middleware

const dynamicRouter = express.Router();

// Create a new dynamic component
dynamicRouter.post("/add",  upload.fields([
    { name: "image1", maxCount: 1 }, 
    { name: "image2", maxCount: 1 }
]), addDynamic);

// Get all dynamic components
dynamicRouter.get("/all",  getAllDynamics);

// Get a single dynamic component by ID
dynamicRouter.get("/:id", getDynamicById);

// Update a dynamic component
dynamicRouter.put("/update/:id",  upload.fields([
    { name: "image1", maxCount: 1 }, 
    { name: "image2", maxCount: 1 }
]), updateDynamic);

// Delete a dynamic component
dynamicRouter.delete("/delete/:id", deleteDynamic);

export default dynamicRouter;