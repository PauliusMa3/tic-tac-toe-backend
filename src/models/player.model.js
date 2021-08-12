const mongoose = require("mongoose");
const { Schema } = mongoose;

const player = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  }
},{ timestamps: { createdAt: 'createdAt'}});

const User = mongoose.model("Player", player);
module.exports = User;
