import mongoose from "mongoose";
import { minLength } from "zod";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
      minLength: 8,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    avatar: {
      type: String,
      default: "/profile_icon.jpg",
    },
  },
  { timestamps: true }
);

const UserModel =
  mongoose.models.user || mongoose.model("user", UserSchema);

export default UserModel;
