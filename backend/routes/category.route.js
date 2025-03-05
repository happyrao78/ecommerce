import { addCategory, getCategories, addSubCategory, getSubCategories, editCategory, removeCategory, editSubCategory, removeSubCategory } from "../controllers/category.controller.js";
import express from "express";

const catRouter = express.Router();

catRouter.post("/addCategory", addCategory);
catRouter.get("/getCategory", getCategories);
catRouter.post("/addSubCategory", addSubCategory);
catRouter.get("/getSubCategory", getSubCategories);
catRouter.put("/editCategory", editCategory);
catRouter.delete("/removeCategory", removeCategory);
catRouter.put("/editSubCategory", editSubCategory);
catRouter.delete("/removeSubCategory", removeSubCategory);

export default catRouter;
