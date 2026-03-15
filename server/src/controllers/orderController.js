import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

export async function createOrder(req, res) {
  try {
    const { fullName, address, phone, pinCode, paymentMethod } = req.body;
    if (!fullName || !address || !phone || !pinCode || !paymentMethod) {
      return res.status(400).json({ message: "Shipping and payment fields are required" });
    }

    const cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const items = cart.items.map((entry) => ({
      productId: entry.productId._id,
      name: entry.productId.name,
      price: entry.productId.price,
      quantity: entry.quantity
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 6);

    const order = await Order.create({
      userId: req.user._id,
      items,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === "Cash on Delivery" ? "Pending" : "Initiated",
      deliveryAddress: `${fullName}, ${address}, ${pinCode}, ${phone}`,
      estimatedDeliveryDate
    });

    cart.items = [];
    await cart.save();

    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getMyOrders(req, res) {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getOrderById(req, res) {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isOwner = order.userId.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
