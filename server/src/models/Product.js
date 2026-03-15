import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    image: { type: String, default: "" },
    category: { type: String, default: "General" }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
