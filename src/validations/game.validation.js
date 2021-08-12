const Joi = require("joi");

const createGameSchema = Joi.object().keys({
  player1: Joi.string().required(),
  player2: Joi.string().required()
});

const setPlayerMoveSchema = Joi.object().keys({
  id: Joi.string().required(),
  turn: Joi.object({
    name: Joi.string().required()
  }),
  position: Joi.number().integer().required()
});

module.exports = {
  createGameSchema,
  setPlayerMoveSchema
};
