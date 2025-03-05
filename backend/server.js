import express from "express";
import cors from "cors"
import "dotenv/config"
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import adminRouter from "./routes/admin.route.js";
import reviewRouter from "./routes/reviews.route.js";
import catRouter from "./routes/category.route.js";
import wishlistRouter from "./routes/wishlistRoute.js";
import attributeRouter from "./routes/attribute.route.js";
import dynamicRouter from "./routes/dynamic.route.js";
import extractDeviceInfo from "./middleware/device.info.middleware.js";


//App Config
const app = express();
const port =process.env.PORT 
connectDB();
connectCloudinary();

//Middlewares

app.use(express.json())
app.use(cors())
app.use(extractDeviceInfo);

//api endpoints
app.use("/api/user",userRouter)
app.use("/api/admin",adminRouter)
app.use("/api/product",productRouter)
app.use("/api/cart",cartRouter)
app.use("/api/wishlist",wishlistRouter)
app.use("/api/order",orderRouter)
app.use("/api/review",reviewRouter)
app.use("/api/category", catRouter)
app.use("/api/attribute",attributeRouter)
app.use("/api/dynamic", dynamicRouter)



app.get("/",(req,res)=>{ 
    res.send("Backend Working");
})

app.listen(port,()=>{
    console.log("Server started on port:"+ port);
    
});