const { Game } = require("../models");

class GameRepository {
  constructor() {}

  createNewGame({ player1, player2, turn }) {
    return Game.create({
      players: [player1, player2],
      turn,
      moves: []
    });
  }

  findGameById(gameId) {
    return Game.findOne({
      _id: gameId
    })
      .populate("moves")
      .populate("turn")
      .populate("players");
  }

  updateGame({ gameId, turn, winner, finished, move }) {
    return Game.findOneAndUpdate(
      {
        _id: gameId
      },
      {
        turn: turn,
        winner,
        finished,
        $push: { moves: move }
      },
      { new: true }
    )
      .populate("moves", { _id: 0, position: 1, symbol: 1, player: 1 })
      .populate("turn", { _id: 1, name: 1 });
  }
}

module.exports = new GameRepository();
