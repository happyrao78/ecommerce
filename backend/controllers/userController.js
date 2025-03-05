import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// Unified login/register method for both local and Google authentication
const authenticateUser = async (req, res) => {
    try {
        const { 
            name, 
            email, 
            password, 
            firebaseUid, 
            googleSignIn, 
            emailPasswordSignIn 
        } = req.body;

        console.log(req.body)

        // Check if user exists
        let user = await userModel.findOne({ email });

        if (googleSignIn) {
            // Google Sign-In Flow
            if (!user) {
                // Register new Google user
                user = new userModel({
                    name: name || "Google User",
                    email,
                    googleId: firebaseUid,
                    authMethod: "google"
                });
                await user.save();
            } else if (user.authMethod === "local") {
                return res.json({ 
                    success: false, 
                    message: "This email is already registered with a local account." 
                });
            }
        } else if (emailPasswordSignIn) {
            // Firebase Email/Password Authentication Flow
            if (!user) {
                // Ensure valid email and strong password
                if (!validator.isEmail(email)) {
                    return res.json({ success: false, message: "Please enter a valid email" });
                }
                
                if (!password || (password.length < 8 && !validator.isStrongPassword(password))) {
                    return res.json({ success: false, message: "Please enter a strong password" });
                }

                // Register user with Firebase UID
                user = new userModel({
                    name,
                    email,
                    googleId: firebaseUid,  // Store Firebase UID for future login reference
                    authMethod: "firebase"
                });
                await user.save();
            } else {
                // Login for Firebase Email/Password users
                if (user.authMethod !== "firebase") {
                    return res.json({ 
                        success: false, 
                        message: "This account was created using a different method." 
                    });
                }

                // Ensure provided Firebase UID matches stored UID
                if (user.googleId !== firebaseUid) {
                    return res.json({ success: false, message: "Invalid credentials" });
                }
            }
        } else {
            // Local Authentication Flow (Traditional Email/Password)
            if (!user) {
                if (!validator.isEmail(email)) {
                    return res.json({ success: false, message: "Please enter a valid email" });
                }

                if (!password ) {
                    return res.json({ success: false, message: "Please enter a strong password" });
                }

                // Hash password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                user = new userModel({
                    name,
                    email,
                    password: hashedPassword,
                    authMethod: "local"
                });
                await user.save();
            } else {
                if (user.authMethod === "google" || user.authMethod === "firebase") {
                    return res.json({ 
                        success: false, 
                        message: "This account was created using a different authentication method." 
                    });
                }

                // Verify password for traditional local sign-in
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return res.json({ success: false, message: "Invalid Credentials" });
                }
            }
        }

        // Update login history
        user.loginHistory.push({
            timestamp: new Date(),
            deviceInfo: req.deviceInfo || {}
        });
        await user.save();

        // Create and send token
        const token = createToken(user._id);
        
        res.json({ 
            success: true, 
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                authMethod: user.authMethod
            }
        });
    
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Existing methods with minor modifications
const loginUser = async (req, res) => {
    // Redirect to unified authentication method
    await authenticateUser(req, res);
}

const registerUser = async (req, res) => {
    // Redirect to unified authentication method
    await authenticateUser(req, res);
}

const getUserLoginHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        
        res.json({ 
            success: true, 
            loginHistory: user.loginHistory 
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        console.log(user)
        res.json({ success: true, user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const getAllUsers = async (req, res) => {
    try {
        // Fetch all users, excluding sensitive information
        const users = await userModel.find({}).select('-password');
        
        // Check if any users exist
        if (!users || users.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "No users found" 
            });
        }

        // Prepare users response
        const usersResponse = users.map(user => ({
            _id: user._id,
            name: user.name,
            email: user.email,
            authMethod: user.authMethod,
            loginHistory: user.loginHistory,
            cartData: user.cartData,
            wishlistData: user.wishlistData,
            phone: user.phone,
            createdAt: user.createdAt
        }));
        
        // Send successful response
        res.json({ 
            success: true, 
            users: usersResponse,
            total: users.length
        });

    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error",
            error: error.message 
        });
    }
};

const getMonthlyUserCount = async (req, res) => {
    try {
        const monthlyUsers = await userModel.aggregate([
            // Convert createdAt to month
            { 
                $addFields: { 
                    month: { 
                        $dateToString: { 
                            format: "%B", 
                            date: "$createdAt" 
                        } 
                    } 
                } 
            },
            // Group by month and count users
            {
                $group: {
                    _id: "$month",
                    count: { $sum: 1 }
                }
            },
            // Sort by month
            { 
                $sort: { 
                    "_id": 1 
                } 
            },
            // Reshape the output
            {
                $project: {
                    month: "$_id",
                    count: 1,
                    _id: 0
                }
            }
        ])

        res.json({ 
            success: true, 
            monthlyUsers 
        })
    } catch (error) {
        console.error("Monthly User Count Error:", error)
        res.status(500).json({ 
            success: false, 
            message: error.message 
        })
    }
}


export { 
    loginUser, 
    registerUser, 
    getUsers, 
    getUserLoginHistory,
    authenticateUser,
    getAllUsers,
    getMonthlyUserCount
};