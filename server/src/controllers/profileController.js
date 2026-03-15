import User from "../models/User.js";
import Product from "../models/Product.js";

export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function updateProfile(req, res) {
  try {
    const { name, phone, address } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;

    await user.save();

    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getSavedAddress(req, res) {
  try {
    const user = await User.findById(req.user._id).select("address");
    return res.json({ address: user?.address || "" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getWishlist(req, res) {
  try {
    const user = await User.findById(req.user._id)
      .populate("wishlist")
      .select("wishlist");

    return res.json(user?.wishlist || []);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function toggleWishlist(req, res) {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const product = await Product.findById(productId).select("_id");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const exists = user.wishlist.some((id) => id.toString() === productId);
    if (exists) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    } else {
      user.wishlist.unshift(product._id);
    }

    await user.save();
    await user.populate("wishlist");

    return res.json({ added: !exists, items: user.wishlist });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getRecentlyViewed(req, res) {
  try {
    const user = await User.findById(req.user._id)
      .populate("recentlyViewed")
      .select("recentlyViewed");

    return res.json(user?.recentlyViewed || []);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function pushRecentlyViewed(req, res) {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const product = await Product.findById(productId).select("_id");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.recentlyViewed = [
      product._id,
      ...user.recentlyViewed.filter((id) => id.toString() !== productId)
    ].slice(0, 12);

    await user.save();
    await user.populate("recentlyViewed");

    return res.json(user.recentlyViewed);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
