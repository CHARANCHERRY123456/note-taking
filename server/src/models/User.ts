// src/models/User.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  authType: "email" | "google";
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  authType: { type: String, enum: ["email", "google"], required: true }
});

export const User = mongoose.model<IUser>("User", userSchema);
