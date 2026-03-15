import mongoose from "mongoose";

const dbStatus = {
  ready: false,
  error: "Database connection not initialized"
};

export default async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    dbStatus.ready = false;
    dbStatus.error = "MONGO_URI is not set";
    console.log("MONGO_URI not set. Running without database connection.");
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });
    dbStatus.ready = true;
    dbStatus.error = null;
    console.log("MongoDB connected");
  } catch (error) {
    dbStatus.ready = false;
    dbStatus.error = error.message;
    console.error("MongoDB connection failed:", error.message);
  }
}

export function getDbStatus() {
  return dbStatus;
}
