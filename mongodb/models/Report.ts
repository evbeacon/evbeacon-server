const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      default: "Charger",
      enum: ["User", "Charger", "Vehicle"],
      index: true,
    },
    reported: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    madeBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    explanation: {
      type: String,
      required: true,
      trim: true,
    },
    decided: {
      type: Boolean,
      index: true,
    },
    decidedBy: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },
    ruling: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Report ?? mongoose.model("Report", ReportSchema);
