import express from "express";
import cors from "cors";
import connectDB from "./db/mongodb";
import authRouter from "./routes/authRoutes";
import noteRouter from "./routes/noteRoutes";
import dotenv from "dotenv";
// import "dotenv/config"
dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/notes", noteRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
