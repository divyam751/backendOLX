const mongoose = require("mongoose");

const classifiedSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ["clothing", "electronics", "furniture", "other"],
    required: true,
  },
  image: { type: String, required: true },
  location: { type: String, required: true },
  postedAt: { type: Date, default: Date.now },
  price: { type: Number, required: true },
  owner_name: { type: String },
  owner_email: { type: String },
});

const ClassifiedModel = mongoose.model("Classified", classifiedSchema);

module.exports = { ClassifiedModel };
