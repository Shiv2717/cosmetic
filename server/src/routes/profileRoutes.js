import { Router } from "express";
import {
	getProfile,
	updateProfile,
	getSavedAddress,
	getWishlist,
	toggleWishlist,
	getRecentlyViewed,
	pushRecentlyViewed
} from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/", getProfile);
router.patch("/", updateProfile);
router.get("/address", getSavedAddress);
router.get("/wishlist", getWishlist);
router.post("/wishlist/toggle", toggleWishlist);
router.get("/recently-viewed", getRecentlyViewed);
router.post("/recently-viewed", pushRecentlyViewed);

export default router;
