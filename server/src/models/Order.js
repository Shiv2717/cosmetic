import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: String,
        price: Number,
        quantity: Number
      }
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["UPI", "Credit Card", "Debit Card", "Net Banking", "Cash on Delivery"],
      required: true
    },
    paymentStatus: { type: String, default: "Pending" },
    paymentId: { type: String, default: "" },
    gatewayOrderId: { type: String, default: "" },
    deliveryAddress: { type: String, required: true },
    estimatedDeliveryDate: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
