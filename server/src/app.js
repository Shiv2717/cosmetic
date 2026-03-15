import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB, { getDbStatus } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

await connectDB();

app.get("/", (_req, res) => {
  res.json({ status: "ok", app: "GlowBeauty API" });
});

app.get("/api/health", (_req, res) => {
  const db = getDbStatus();
  res.json({
    status: db.ready ? "ok" : "degraded",
    app: "GlowBeauty API",
    database: db.ready ? "connected" : "disconnected",
    databaseError: db.error
  });
});

app.use("/api", (req, res, next) => {
  if (req.path === "/health") {
    return next();
  }

  const db = getDbStatus();
  if (!db.ready) {
    return res.status(503).json({
      message: "Database unavailable",
      details: db.error
    });
  }

  return next();
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);

export default app;
