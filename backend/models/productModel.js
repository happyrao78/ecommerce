import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

    name:{type:String,required:true},
    description:{type:String,required:true},
    detailedDescription:{type:String,required:true},
    price:{type:Number,required:true},
    originalPrice:{ type:Number, required:true, default:2000},
    image:{type:Array,required:true},
    video: { type: String },
    category:{type:String,required:true},
    subCategory:{type:String,required:true},
    sizes:{type:Array},
    bestseller:{type:Boolean},
    top:{type:Boolean}, 
    newly:{type:Boolean},
    hot:{type:Boolean},
    popular:{type:Boolean},
    reviews:[{ type: mongoose.Schema.Types.ObjectId, ref: "review" }],
    quantity:{type:Number,required:true},
    attributes: [
        {
            attributeId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'attribute'  // This should match your attributeModel name
            },
            selectedValues: [String]
        }
    ],

},{
    timestamps:true
})

const productModel = mongoose.models.productnew || mongoose.model("productnew",productSchema);

export default productModel;