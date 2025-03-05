import express from "express";
import { adminLogin, getAdminPhone,updateAdminPhone } from "../controllers/admin.controller.js";

const adminRouter = express.Router();

adminRouter.post("/admin-login", adminLogin)
adminRouter.get("/admin-phone", getAdminPhone)
adminRouter.post("/admin-phone", updateAdminPhone)

export default adminRouter;