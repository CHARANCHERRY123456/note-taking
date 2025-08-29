import express from "express";
import cors from "cors";
import connectDB from "./db/mongodb";
import authRouter from "./routes/authRoutes";
import dotenv from "dotenv";
// import "dotenv/config"
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
