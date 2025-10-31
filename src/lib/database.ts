import mongoose from "mongoose";

let isConnected = false; // track connection

export async function connectDB() {
  if (isConnected) {
    console.log("✅ MongoDB already connected");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI|| "", {
      dbName: "quiz-generator",
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    });

    if (conn.connections[0].readyState) {
      isConnected = true;
    }
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw new Error("Database connection failed");
  }
}
