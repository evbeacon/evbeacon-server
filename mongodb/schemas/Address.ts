import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  city: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  state: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  country: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  zipCode: {
    type: String,
    trim: true,
    minlength: 1,
  },
});

export default AddressSchema;
