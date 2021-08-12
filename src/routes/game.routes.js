const express = require("express");
const { gameController } = require("../controllers");
const { validationMiddleware } = require("../middlewares");
const { createGameSchema, setPlayerMoveSchema } = require("../validations/game.validation");

const gameRoutes = () => {
  const router = express.Router();
  router.post(
    "/",
    validationMiddleware(createGameSchema),
    gameController.createNewGame
  );
  router.put('/', validationMiddleware(setPlayerMoveSchema),gameController.setPlayerMove)
  router.get('/:gameId', gameController.getGame)
  return router;
};

module.exports = gameRoutes;
