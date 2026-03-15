import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI not set in .env");
  process.exit(1);
}

await mongoose.connect(MONGO_URI);

const existing = await User.findOne({ email: "admin@glowbeauty.com" });
if (existing) {
  console.log("Admin already exists:");
  console.log("  Email:", existing.email);
  console.log("  Role:", existing.role);
  await mongoose.disconnect();
  process.exit(0);
}

const admin = await User.create({
  name: "Admin",
  email: "admin@glowbeauty.com",
  phone: "9999999999",
  password: "Admin@123",
  role: "admin",
});

console.log("Admin user created successfully!");
console.log("  Email   :", admin.email);
console.log("  Password: Admin@123");
console.log("  Role    :", admin.role);

await mongoose.disconnect();
