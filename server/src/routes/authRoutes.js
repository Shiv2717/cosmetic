import { Router } from "express";
import {
  signup,
  login,
  logout,
  recoverPassword,
  resetPassword
} from "../controllers/authController.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/recover-password", recoverPassword);
router.post("/reset-password", resetPassword);

export default router;
