import mongoose, { Document, Schema } from "mongoose";

export type AuthType = "email" | "google";

export interface IUser extends Document {
  name: string;
  dob?: Date;
  email: string;
  authType: AuthType;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    dob: { type: Date, required: false },
    email: { type: String, required: true, unique: true },
    authType: { type: String, enum: ["email", "google"], required: true },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
