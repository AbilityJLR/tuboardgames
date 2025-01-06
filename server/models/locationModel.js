const mongoose = require("mongoose");

const locationSchema = mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  imageURL: {
    type: String,
    require: true
  },
  roles: {
    type: [String],
    require: true
  },
  slug: {
    type: String,
    lowercase: true,
    unique: true
  }
}, { timestamps: true })

module.exports = mongoose.model("Locations", locationSchema)

