const userService = require("./user.service");
const { Game, Move } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/apiError");
const {
  winningPositions,
  minMovesToWin,
  maxMovesOnTheBoard
} = require("../constants/game.constants");
const gameRepository = require("../repositories/game.repository");

const checkIfUserHasWon = (userMoves) => {
  let isWinner = false;
  winningPositions.map((winningCombination) => {
    const hasAllWinningCombinationPositions = winningCombination.every(
      (item) => userMoves.indexOf(item) !== -1
    );
    if (hasAllWinningCombinationPositions) {
      isWinner = true;
    }
  });

  return isWinner;
};

const getGameById = async (gameId) => {
  try {
    const game = await Game.findOne({
      _id: gameId
    })
      .populate({ path: "moves", _id: 0, position: 1, symbol: 1 })
      .populate("turn", { _id: 1, name: 1 });

    if (!game) {
      throw new ApiError(httpStatus.NOT_FOUND, "Failed to find game by id");
    }
    return game;
  } catch (e) {
    throw e;
  }
};

const createNewGame = async (playerNames) => {
  try {
    const player1 = await userService.getOrCreateUserByName(
      playerNames.player1
    );
    const player2 = await userService.getOrCreateUserByName(
      playerNames.player2
    );

    const newGame = await gameRepository.createNewGame({
      player1,
      player2,
      turn: player1
    });

    return {
      ...newGame._doc,
      turn: {
        id: player1.id,
        name: player1.name
      }
    };
  } catch (e) {
    throw e;
  }
};

const setPlayerMoveOnTheBoard = async (params) => {
  const { id, turn, position } = params;
  const game = await gameRepository.findGameById(id);
  if (!game) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to find game by its id");
  }

  if (
    game.finished ||
    game.winner ||
    game.moves.length === maxMovesOnTheBoard
  ) {
    return;
  }

  if (game.turn.name !== turn.name) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to play this game or it is not your turn"
    );
  }
  const { moves } = game;

  const alreadyMadeMoveOnThisPosition = moves.find(
    (item) => item.position === position
  );

  if (alreadyMadeMoveOnThisPosition) {
    throw new Error(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Move was already made on this position"
    );
  }

  const userMoves = moves
    .filter((item) => item.player.equals(game.turn._id))
    .map((item) => item.position);
  userMoves.push(position);

  let userWon = false;
  if (userMoves.length >= minMovesToWin) {
    userWon = checkIfUserHasWon(userMoves);
  }

  const isPlayerOneTurn = game.turn._id.equals(game.players[0]._id);

  const newMove = await Move.create({
    game: game._id,
    player: game.turn._id,
    position: position,
    symbol: isPlayerOneTurn ? "X" : "0"
  });

  const playerTurn = isPlayerOneTurn
    ? game.players[1]._id
    : game.players[0]._id;
  const winner = userWon ? game.turn.name : "";

  const gameFinished =
    userWon || game.moves.length === maxMovesOnTheBoard - 1 ? true : false;

  const updatedGame = await gameRepository.updateGame({
    gameId: game._id,
    turn: playerTurn,
    winner,
    move: newMove,
    finished: gameFinished
  });

  return updatedGame;
};

module.exports = {
  getGameById,
  setPlayerMoveOnTheBoard,
  createNewGame
};
