import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoute from "./router/auth.js";
import dotenv from "dotenv";
import { MongoMemoryServer } from 'mongodb-memory-server';
import likesRoute from "./router/likes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Простейший маршрут
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use('/api/auth', authRoute);
app.use('/api/likes', likesRoute);

// Підключення до MongoDB (реальної або in-memory як fallback)
async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) {
    console.log("Connecting to MongoDB URI...");
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
    return;
  }

  console.warn("MONGODB_URI is not set. Starting in-memory MongoDB (for development/testing)...");
  const mem = await MongoMemoryServer.create();
  const uri = mem.getUri();
  await mongoose.connect(uri);
  console.log("In-memory MongoDB connected");
}

async function start() {
  try {
    // Забезпечуємо наявність секрету для JWT у розробці
    if (!process.env.JWT_SECRET) {
      console.warn("JWT_SECRET is not set. Using a default development secret.");
      process.env.JWT_SECRET = "dev_secret_change_me";
    }

    await connectDatabase();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));
  } catch (error) {
    console.error("Startup error:", error);
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT} (but database connection failed)`);
    });
  }
}

start();
