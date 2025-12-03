import express from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
} from "../controller/AuthController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const authRouter = express.Router();

// Public routes
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

// Protected routes
authRouter.get("/me", authenticate, getCurrentUser);

export default authRouter;


