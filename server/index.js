import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./router/auth.js";
import likesRoute from "./router/likes.js";
import { MongoMemoryServer } from "mongodb-memory-server";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// --- CORS ---
const allowedOrigins = [
  "https://rapid-api-jobs-search-f7xg.vercel.app", 
  "http://localhost:5173"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// --- Middleware ---
app.use(express.json());

// --- Routes ---
app.get("/", (req, res) => res.send("Server is running"));
app.use("/api/auth", authRoute);
app.use("/api/likes", likesRoute);

// --- Connect to DB ---
async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) {
    console.log("Connecting to MongoDB URI...");
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
    return;
  }

  console.warn("MONGODB_URI not set. Starting in-memory MongoDB...");
  const mem = await MongoMemoryServer.create();
  const uri = mem.getUri();
  await mongoose.connect(uri);
  console.log("In-memory MongoDB connected");
}

// --- Start Server ---
async function start() {
  try {
    if (!process.env.JWT_SECRET) {
      console.warn("JWT_SECRET not set. Using default development secret.");
      process.env.JWT_SECRET = "dev_secret_change_me";
    }

    await connectDatabase();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.error("Startup error:", error);
    app.listen(PORT, () => console.log(`Server started on port ${PORT} (DB connection failed)`));
  }
}

start();
