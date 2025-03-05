import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import AdminPhone from "../models/adminPhone.model.js";


//Route for admin login
const adminLogin = async (req, res) => {
    try{
        const{email,password}=req.body
        if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({
                success:true,
                token
            })
        }else{
            res.json({
                success:false,
                message:"Invalid Credentials"
            })
        }
    }catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })

    }

}

const getAdminPhone = async (req, res) => {
    try {
        const adminPhone = await AdminPhone.findOne();
        if (!adminPhone) {
            return res.status(404).json({ message: 'Admin phone number not found' });
        }
        res.status(200).json(adminPhone);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving admin phone number', error });
    }
};

// Update admin phone number
const updateAdminPhone = async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        // Check if phone number is 10 digits
        if (!/^\d{10}$/.test(phoneNumber)) {
            return res.status(400).json({ message: 'Phone number must be 10 digits' });
        }

        // Delete previous phone number
        await AdminPhone.deleteMany({});

        // Add new phone number
        const newAdminPhone = new AdminPhone({ phoneNumber });
        await newAdminPhone.save();

        res.status(200).json({ message: 'Admin phone number updated successfully', adminPhone: newAdminPhone });
    } catch (error) {
        res.status(500).json({ message: 'Error updating admin phone number', error });
    }
};




export { adminLogin,getAdminPhone,updateAdminPhone }