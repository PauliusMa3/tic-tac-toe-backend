const asyncHandler = require("../utils/asyncHandler");
const {gameService } = require("../services");
const httpStatus = require("http-status");
const ApiError = require("../utils/apiError");


const createNewGame = asyncHandler(async (req, res) => {
  const players = req.body;
  const newGame = await gameService.createNewGame(players);
  return res.status(httpStatus.CREATED).json(newGame);
});


const setPlayerMove = asyncHandler(async (req, res) => {
  const updatedGame = await gameService.setPlayerMoveOnTheBoard(req.body);
  return res.status(httpStatus.OK).json(updatedGame)
});

const getGame = asyncHandler(async (req, res) => {
  const {gameId = ''} = req.params;
  if(!gameId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No id was provided');
  }
  const game = await gameService.getGameById(gameId);

  return res.status(httpStatus.OK).json(game);
});



module.exports = {
  getGame,
  setPlayerMove,
  createNewGame
};
