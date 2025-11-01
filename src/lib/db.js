import mongoose from "mongoose";

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    console.log("✅ MongoDB already Connected");
    return; // already connected
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "chat-app",
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Error:", error);
  }
}
