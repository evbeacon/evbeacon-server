const mongoose = require("mongoose");
const pointSchema = require("../schemas/Point");
const addressSchema = require("../schemas/Address");

const ChargerSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  location: {
    type: pointSchema,
    required: true,
    index: "2dsphere",
  },
  address: {
    type: addressSchema,
    required: true,
  },
  description: {
    type: String,
  },
});

export default mongoose.models.Charger ??
  mongoose.model("Charger", ChargerSchema);
