import mongoose from "mongoose";
import locationSchema from "../schemas/Location";
import addressSchema from "../schemas/Address";

const ChargerSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    location: {
      type: locationSchema,
      required: true,
      index: "2dsphere",
    },
    address: {
      type: addressSchema,
      required: true,
    },
    plugType: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    offHoursStartUTC: {
      type: Date,
    },
    offHoursEndUTC: {
      type: Date,
    },
    disabledUntilUTC: {
      type: Date,
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

export default mongoose.models.Charger ??
  mongoose.model("Charger", ChargerSchema);
