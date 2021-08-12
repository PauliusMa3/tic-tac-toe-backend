const mongoose = require("mongoose");
const { Schema } = mongoose;

const gameSchema = new Schema({
  finished: {
    type: Boolean,
    default: false
  },
  winner: {
    type: String
  },
  players: [
    {
      player1: {
        type: Schema.Types.ObjectId,
        ref: "Player"
      },
      player2: {
        type: Schema.Types.ObjectId,
        ref: "Player"
      }
    }
  ],
  moves: [
    {
      type: Schema.Types.ObjectId,
      ref: "Move"
    }
  ],
  turn: {
    type: Schema.Types.ObjectId,
    ref: "Player"
  }
});

const Game = mongoose.model("Game", gameSchema);
module.exports = Game;
