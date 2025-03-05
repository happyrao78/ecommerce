import mongoose from 'mongoose';

const dynamicSchema = new mongoose.Schema({ 
    title : { type : String, required : true },
    subtitle : { type : String, required : true },
    image : { type : Array, required : false },
    redirectLink : { type : String, default :'http://localhost:5173/collection'},
},
{
    timestamps : true,
});

const dynamicModel = mongoose.model('Dynamic', dynamicSchema);

export default dynamicModel;