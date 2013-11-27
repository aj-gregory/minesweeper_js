(function(root) {
  var Minsweeper = root.Minesweeper = (root.Minesweeper || {});

  if (!(typeof(require) === "undefined")) {
    _ = require('./underscore.js');
  }

  var Game = Minesweeper.Game = function() {
    this.gameEnded = false;
    this.UI = new MinesweeperUI.UI()
    this.exploredTiles = [];
    this.board = this.createBoard();
    this.addMines();
  }

  Game.prototype.createBoard = function() {
    board = []
    for(var i = 0; i < 8; i++) {
      board.push([null, null, null, null, null, null, null, null])
    };
    return board;
  }

  Game.prototype.addMines = function() {
    var bombTiles = [];

    while (bombTiles.length < 10) {
      var randRowNum = Math.floor(Math.random() * 8);
      var randTileNum = Math.floor(Math.random() * 8);
    
      if (this.board[randRowNum][randTileNum] !== 'b') {
        this.board[randRowNum][randTileNum] = 'b';
        bombTiles.push([randRowNum, randTileNum]);
      }
    }
  }

  Game.prototype.checkTile = function(coords) {
    if (!this.gameEnded) {
      gameTile = this.board[coords[0]][coords[1]];
      if (gameTile === 'b') {
        this.gameOver();
      } else {
        this.revealTile(coords);
      }
    }
  }

  Game.prototype.revealTile = function(coords) {
    var that = this;
    var neighborDirections = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1],[-1,-1],[1,-1]];

    this.exploredTiles.push(coords);
    var neighboringBombs = this.checkNeighbors(coords);
    this.UI.revealTile(coords[0], coords[1], neighboringBombs);

    if (neighboringBombs === 0) {
      neighborDirections.forEach(function(dir) {
        var coordsToCheck = [coords[0] + dir[0], coords[1] + dir[1]]
        if (isOnBoard(coordsToCheck)) {
          var notChecked = true;

          that.exploredTiles.forEach(function(coords) {
            if (coords[0] === coordsToCheck[0] && coords[1] === coordsToCheck[1]) {
              notChecked = false;
            }
          });

          if (notChecked) {
            that.revealTile(coordsToCheck);
          }
        }
      });
    }
  }

  Game.prototype.gameOver = function() {
    this.UI.tellPlayer('You lose! Please start a new game to continue.')
    this.gameEnded = true;
  }

  Game.prototype.win = function() {
    this.UI.tellPlayer('You win! Please start a new game to continue.')
    this.gameEnded = true;
  }

  Game.prototype.checkNeighbors = function(coords) {
    var that = this;
    var neighboringBombs = 0;
    var directions = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1],[-1,-1],[1,-1]];

    directions.forEach(function(dir) {
      var coordsToCheck = [coords[0] + dir[0], coords[1] + dir[1]];
      if (isOnBoard(coordsToCheck)) {
        if (that.board[coordsToCheck[0]][coordsToCheck[1]] === 'b') {
          neighboringBombs++;
        } 
      }
    });

    return neighboringBombs; 
  }

  Game.prototype.cheat = function() {
    var that = this;
      for (var i = 0; i < 8; i++) { 
        for (var j = 0; j < 8; j++) {
          if (that.board[i][j] === 'b') {
            that.UI.markBomb(i, j);
          }
        };
    };
  }

  Game.prototype.validate = function() {
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++){
        if (this.board[i][j] !== 'b') {
          if (!this.UI.validateSquare(i,j)) {
            return false;
          }
        }
      }
    }
    return true;
  }

  var isOnBoard = function(coords){
    if (coords[0] > -1 && coords[0] < 8 && coords[1] > -1 && coords[1] < 8) {
      return true;
    } else {
      return false;
    }
  }

})(this);

var Game = new this.Minesweeper.Game();