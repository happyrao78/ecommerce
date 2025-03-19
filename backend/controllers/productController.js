import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js"
import userModel from "../models/userModel.js"

// addproduct
const addProduct = async (req, res) => {
    try {
        const { name, description,detailedDescription, price,originalPrice, category, subCategory, sizes, bestseller,top,newly,hot,popular, quantity,attributes } = req.body;
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];
        const video =  req.files.video && req.files.video[0];

        const images = [image1, image2, image3, image4].filter((item) => item != undefined)
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: "image" })
                return result.secure_url
            })
        )
        let videoUrl = "";
        if (video) {
            const videoResult = await cloudinary.uploader.upload(video.path, { resource_type: "video" });
            videoUrl = videoResult.secure_url;
        }

        const productData = {
            name,
            description,
            detailedDescription,
            price:Number(price),
            originalPrice :Number(originalPrice),
            image : imagesUrl,
            video : videoUrl,
            category,
            subCategory,
            sizes: JSON.parse(sizes),
            bestseller:bestseller ==="true"  ? true : false,
            top:top ==="true"  ? true : false,
            newly:newly ==="true"  ? true : false,
            hot:hot ==="true"  ? true : false,
            popular:popular ==="true"  ? true : false,
            quantity:Number(quantity),
           date: Date.now(),
        }

       // In your controller
if (attributes) {
    try {
        const parsedAttributes = JSON.parse(attributes);
        if (parsedAttributes.length > 0) {
            productData.attributes = parsedAttributes.map(attr => ({
                attributeId: attr.attributeId,
                selectedValues: attr.values
            }));
        }
    } catch (error) {
        console.error("Error parsing attributes:", error);
    }
}

        const product = new productModel(productData);
        await product.save();
        res.json({success: true, message: "Product Added "});
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}


// list product
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});

        const productsWithDefaultPrice = products.map(product => ({
            ...product._doc,
            originalPrice: product.originalPrice || 2000 // Use 2000 if originalPrice is undefined
        }));
        res.json({success:true,products : productsWithDefaultPrice})
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//function-remove product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Product Removed"})

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

//function-single product info
const singleProduct = async (req, res) => {
    try {
        const {productId} = req.body
        const product = await productModel.findById(productId)
        res.json({success:true,product})
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

const updateProduct = async (req, res) => {
    try {
        const { 
            name, 
            description, 
            detailedDescription,
            price, 
            originalPrice, 
            category, 
            subCategory, 
            sizes, 
            bestseller, 
            top,
            newly,
            hot,
            popular,
            quantity, 
            productId,
            existingImages, // This will be a JSON string containing URLs or nulls
            existingVideo
        } = req.body;
        
        // Get the existing product data
        const existingProduct = await productModel.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Parse the existingImages JSON string
        let parsedExistingImages = [];
        if (existingImages) {
            parsedExistingImages = JSON.parse(existingImages);
        }
        
        // Initialize finalImages as the parsed images (filtering out nulls)
        let finalImages = parsedExistingImages.filter(url => url !== null);
        
        // Process new image uploads and add them to finalImages
        if (req.files) {
            for (let i = 1; i <= 4; i++) {
                if (req.files[`image${i}`] && req.files[`image${i}`][0]) {
                    // If there's a new image at this position, upload it
                    const result = await cloudinary.uploader.upload(
                        req.files[`image${i}`][0].path, 
                        { resource_type: "image" }
                    );
                    
                    // Add the new image URL to our array at the right position
                    // If parsedExistingImages has a null at this position, we're replacing it
                    if (i - 1 < parsedExistingImages.length && parsedExistingImages[i - 1] === null) {
                        // Find the correct position to insert this image
                        let insertIndex = 0;
                        for (let j = 0; j < i - 1; j++) {
                            if (parsedExistingImages[j] !== null) {
                                insertIndex++;
                            }
                        }
                        finalImages.splice(insertIndex, 0, result.secure_url);
                    } else {
                        // Just add it to the end
                        finalImages.push(result.secure_url);
                    }
                }
            }
        }
        
        // Handle video upload if present
        let videoUrl = existingProduct.video; // Default to existing video
        if (existingVideo) {
            videoUrl = existingVideo; // Use provided existing video
        }
        if (req.files?.video && req.files.video[0]) {
            const videoResult = await cloudinary.uploader.upload(
                req.files.video[0].path, 
                { resource_type: "video" }
            );
            videoUrl = videoResult.secure_url;
        }

        // Prepare the updated product data
        const productData = {
            name,
            description,
            detailedDescription,
            price: Number(price),
            originalPrice: Number(originalPrice),
            image: finalImages,
            video: videoUrl,
            category,
            subCategory,
            sizes: JSON.parse(sizes),
            bestseller: bestseller === "true" ? true : false,
            top: top === "true" ? true : false,
            newly: newly === "true" ? true : false,
            hot: hot === "true" ? true : false,
            popular: popular === "true" ? true : false,
            quantity: Number(quantity),
        };

        // Update the product
        const product = await productModel.findByIdAndUpdate(productId, productData, { new: true });
        
        res.json({ success: true, message: "Product Updated", product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


export { addProduct, listProducts, removeProduct, singleProduct, updateProduct };