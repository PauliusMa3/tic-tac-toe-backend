const mongoose = require("mongoose");
const { Schema } = mongoose;

const moveSchema = new Schema({
  position: {
    type: Number,
    required: true,
  },
  symbol: {
    type: String,
    required: true
  },
  game: {
    type: Schema.Types.ObjectId,
    ref: 'Game'
  },
  player: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
},{ timestamps: { createdAt: 'createdAt'}});

const Move = mongoose.model("Move", moveSchema);
module.exports = Move;
