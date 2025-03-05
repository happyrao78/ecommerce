import express from "express";
import { loginUser,registerUser,getUsers,getUserLoginHistory,getAllUsers,getMonthlyUserCount} from "../controllers/userController.js";
import authUser from "../middleware/auth.js";

const userRouter = express.Router();


userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.get("/get-user",authUser,getUsers)
userRouter.get("/login-history",getUserLoginHistory)
userRouter.get("/all", getAllUsers);
userRouter.get("/monthly-count", getMonthlyUserCount);
export default userRouter;
