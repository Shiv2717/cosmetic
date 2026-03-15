import { Router } from "express";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  getAllUsers
} from "../controllers/adminController.js";
import { getStats } from "../controllers/statsController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, adminOnly);
router.get("/stats", getStats);
router.post("/products", addProduct);
router.patch("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
router.get("/orders", getAllOrders);
router.get("/users", getAllUsers);

export default router;
