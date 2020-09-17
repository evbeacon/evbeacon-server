const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    index: true,
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
  },
  bio: {
    type: String,
  },
});

export default mongoose.models.User ?? mongoose.model("User", UserSchema);
