import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      index: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "User",
      enum: ["Admin", "User"],
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      default: "",
      trim: true,
    },
    expoPushToken: {
      type: String,
      trim: true,
    },
    finishedCharger: {
      type: Boolean,
      default: false,
    },
    finishedVehicle: {
      type: Boolean,
      default: false,
    },
    banned: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User ?? mongoose.model("User", UserSchema);
