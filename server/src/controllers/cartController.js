import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }
  return cart;
}

export async function getCart(req, res) {
  try {
    const cart = await getOrCreateCart(req.user._id);
    await cart.populate("items.productId");
    return res.json(cart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function addToCart(req, res) {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cart = await getOrCreateCart(req.user._id);
    const existing = cart.items.find((item) => item.productId.toString() === productId);

    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      cart.items.push({ productId, quantity: Number(quantity) });
    }

    await cart.save();
    await cart.populate("items.productId");
    return res.status(201).json(cart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function updateCartItem(req, res) {
  try {
    const { quantity } = req.body;
    if (!quantity || Number(quantity) < 1) {
      return res.status(400).json({ message: "quantity must be at least 1" });
    }

    const cart = await getOrCreateCart(req.user._id);
    const item = cart.items.find((entry) => entry.productId.toString() === req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    item.quantity = Number(quantity);
    await cart.save();
    await cart.populate("items.productId");
    return res.json(cart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function removeCartItem(req, res) {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = cart.items.filter((entry) => entry.productId.toString() !== req.params.id);
    await cart.save();
    await cart.populate("items.productId");
    return res.json(cart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
