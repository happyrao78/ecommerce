import express from "express";
import { addProduct,listProducts,removeProduct,singleProduct,updateProduct } from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";
// import authUser from "../middleware/auth.js";

const productRouter = express.Router();

productRouter.post("/add",adminAuth,
     upload.fields([
          {name:"image1",maxCount:1},   {name:"image2",maxCount:1},
          {name:"image3",maxCount:1},{name:"image4",maxCount:1},
     {name:"video", maxCount:1}]),addProduct

)
productRouter.post("/remove",removeProduct);
productRouter.post("/single",adminAuth,singleProduct);
productRouter.get("/list",listProducts);
productRouter.put("/update",adminAuth,upload.fields([
     {name:"image1",maxCount:1},   {name:"image2",maxCount:1},
     {name:"image3",maxCount:1},{name:"image4",maxCount:1},
{ name: "video", maxCount: 1 }]),updateProduct);




export default productRouter;