const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
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
  },
  model: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  plugType: {
    type: String,
    required: true,
  },
  licensePlate: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Vehicle ??
  mongoose.model("Vehicle", VehicleSchema);
