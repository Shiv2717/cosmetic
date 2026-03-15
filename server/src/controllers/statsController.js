import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

export async function getStats(_req, res) {
  try {
    const [totalProducts, totalOrders, totalUsers, paidOrders] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: "user" }),
      Order.find({ paymentStatus: "Paid" }).select("totalAmount")
    ]);

    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return res.json({ totalProducts, totalOrders, totalUsers, totalRevenue });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
