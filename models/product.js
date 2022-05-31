const mongoose = require("mongoose");

// Mongoose Schema Types: https://mongoosejs.com/docs/schematypes.html
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "product name must be provided"],
  },
  price: {
    type: Number,
    required: [true, "product price must be provided"],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  company: {
    type: String,
    enum: { // Array, creates a validator that checks if the value is in the given array.
      values: ["ikea", "liddy", "caressa", "marcos"],
      message: "{VALUE} is not supported", // custom error message. {VALUE} is entered value 
    },
    // enum: ['ikea', 'liddy', 'caressa', 'marcos'], // without custom error message 
  },
});

module.exports = mongoose.model("Product", productSchema);
