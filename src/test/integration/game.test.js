const chai = require("chai");
const chaiHttp = require("chai-http");
const { Game, Move, Player } = require("../../models");
const { gameService, userService } = require("../../services");
const { startServer } = require("../../startServer");

chai.use(chaiHttp);
chai.should();

const { expect } = chai;
let server;

let ticTacToeGame;

let playerNames = {
  player1: "random1",
  player2: "random2"
};

before(async function () {
  server = await startServer();
});

beforeEach(async function () {
  ticTacToeGame = await gameService.createNewGame(playerNames);
});

afterEach(async () => {
  await Promise.all([
    Game.deleteOne({
      _id: ticTacToeGame._id
    }),
    Move.deleteMany({
      game: ticTacToeGame._id
    })
  ]);
});

after(async () => {
  await Player.deleteMany({
    name: [playerNames.player1, playerNames.player2]
  });
});

describe("Tic Tac Toe Tests", () => {
  describe("/GET game", function () {
    it("it should get game by id", async function () {
      const res = await chai
        .request(server)
        .get(`/api/game/${ticTacToeGame._id}`);

      expect(res.status).to.equal(200);
      expect(res.body.turn).to.have.property("name", playerNames.player1);
    });
  });

  describe("Play Game", function () {
    it("it should not allow single player consecutive moves", async function () {
      let playerMove = {
        id: ticTacToeGame._id,
        turn: {
          name: playerNames.player1
        },
        position: 0
      };
      const res = await chai.request(server).put("/api/game").send(playerMove);
      expect(res.status).to.equal(200);

      let playerMove2 = {
        id: ticTacToeGame._id,
        turn: {
          name: playerNames.player1
        },
        position: 2
      };
      const res2 = await chai
        .request(server)
        .put("/api/game")
        .send(playerMove2);

      expect(res2.status).to.equal(403);
    });

    it("it should not allow to place item on the same position", async function () {
      let playerMove = {
        id: ticTacToeGame._id,
        turn: {
          name: playerNames.player1
        },
        position: 2
      };
      const res = await chai.request(server).put("/api/game").send(playerMove);
      expect(res.status).to.equal(200);

      let playerMove2 = {
        id: ticTacToeGame._id,
        turn: {
          name: playerNames.player2
        },
        position: 2
      };
      const res2 = await chai
        .request(server)
        .put("/api/game")
        .send(playerMove2);

      expect(res2.status).to.equal(500);
    });

    it("it should return game winner", async function () {
      const [player1, player2] = await Promise.all([
        userService.getOrCreateUserByName(playerNames.player1),
        userService.getOrCreateUserByName(playerNames.player2)
      ]);

      const gameMoves = [
        {
          game: ticTacToeGame._id,
          player: player1._id,
          position: 0,
          symbol: "X"
        },
        {
          game: ticTacToeGame._id,
          player: player2._id,
          position: 6,
          symbol: "0"
        },
        {
          game: ticTacToeGame._id,
          player: player1._id,
          position: 1,
          symbol: "X"
        },
        {
          game: ticTacToeGame._id,
          player: player2._id,
          position: 7,
          symbol: "0"
        }
      ];

      const moves = await Move.create(gameMoves);

      await Game.updateOne(
        {
          _id: ticTacToeGame._id
        },
        {
          moves
        }
      );

      let winningPlayerMove = {
        id: ticTacToeGame._id,
        turn: {
          name: playerNames.player1
        },
        position: 2
      };

      await chai.request(server).put("/api/game").send(winningPlayerMove);

      const res = await chai
        .request(server)
        .get(`/api/game/${ticTacToeGame._id}`);

      expect(res.body).to.have.property("winner", player1.name);
      expect(res.body).to.have.property("finished", true);
    });
  });
});
