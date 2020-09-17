import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    year: {
      type: Number,
      required: true,
    },
    make: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    plugType: {
      type: String,
      required: true,
      trim: true,
    },
    licensePlate: {
      type: String,
      required: true,
      index: true,
      unique: true,
      trim: true,
      minlength: 1,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Vehicle ??
  mongoose.model("Vehicle", VehicleSchema);
