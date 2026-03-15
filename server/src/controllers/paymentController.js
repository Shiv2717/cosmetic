import crypto from "crypto";
import Razorpay from "razorpay";
import Order from "../models/Order.js";

function getRazorpayClient() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return null;
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

export async function createPayment(req, res) {
  try {
    const { amount, currency = "INR", orderId } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({ message: "amount and orderId are required" });
    }

    const razorpay = getRazorpayClient();
    if (!razorpay) {
      return res.status(400).json({ message: "Razorpay is not configured" });
    }

    const rpOrder = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency,
      receipt: `gb_${Date.now()}`
    });

    return res.status(201).json({
      keyId: process.env.RAZORPAY_KEY_ID,
      order: rpOrder
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function verifyPayment(req, res) {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "orderId is required" });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Razorpay signature payload is required" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = generatedSignature === razorpay_signature;
    if (!isValid) {
      return res.status(400).json({ message: "Invalid Razorpay signature" });
    }

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "Paid",
      paymentId: razorpay_payment_id,
      gatewayOrderId: razorpay_order_id
    });

    return res.json({ message: "Razorpay payment verified" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
