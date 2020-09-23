import mongoose from "mongoose";
import locationSchema from "../schemas/Location";

const BeaconSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    vehicleRange: {
      type: Number,
      required: true,
    },
    location: {
      type: locationSchema,
      required: true,
      index: "2dsphere",
    },
    allowedChargers: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    cancelled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Beacon ?? mongoose.model("Beacon", BeaconSchema);
