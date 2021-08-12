const express = require("express");
const gameRoutes = require("./game.routes");

function appRoutes() {
  const router = express.Router();
  router.use("/game", gameRoutes());
  return router;
}

module.exports = appRoutes;
