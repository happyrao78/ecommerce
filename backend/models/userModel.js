// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     phone:{type : Number, required:false},
//     cartData: { type: Object, default: {} },
//     wishlistData: { type: Object, default: {} },
//     loginHistory: [{ 
//         timestamp: { type: Date, default: Date.now },
//         deviceInfo: { type: Object }
//     }]
// }, 
// { minimize: false,
//     timestamps: true
//  })

// const userModel = mongoose.model.user || mongoose.model("user",userSchema)


// export default userModel;


import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // Make password optional
    phone: { type: Number, required: false },
    cartData: { type: Object, default: {} },
    wishlistData: { type: Object, default: {} },
    loginHistory: [{ 
        timestamp: { type: Date, default: Date.now },
        deviceInfo: { type: Object }
    }],
    // New fields for Google authentication
    googleId: { type: String, required: false},
    authMethod: { 
        type: String, 
        enum: ['local', 'google','firebase'], 
        default: 'local' 
    }
}, 
{ 
    minimize: false,
    timestamps: true 
})

const userModel = mongoose.model.user || mongoose.model("user", userSchema)

export default userModel;