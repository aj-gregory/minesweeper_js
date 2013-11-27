(function(root) {
  var MinesweeperUI = root.MinesweeperUI = (root.MinesweeperUI || {});
 
 var UI = MinesweeperUI.UI = function() {
    var that = this;

    $(document).ready(function() {
      $('.tile').click(function(event){
        Game.checkTile(eval($(event.currentTarget).attr('data-coords')));
      });

      $('.cheat').click(function(){
        Game.cheat();
      });

      $('.new').click(function(){
        that.refreshRender();
        Game = new Minesweeper.Game();
      });

      $('.validate').click(function(){
        if (Game.validate()) {
          Game.win();
        } else {
          Game.gameOver();
        }
      });
    });
  } 

  UI.prototype.revealTile = function(x, y, numBombs) {
    $tile = $('.tile[data-coords="[' + x + ',' + y + ']"]');
    $tile.css({'background-color': 'white'});
    $tile.addClass('revealed');
    if (numBombs !== 0) {
      $tile.html(numBombs);
    }
  }

  UI.prototype.markBomb = function(x, y) {
    $tile = $('.tile[data-coords="[' + x + ',' + y + ']"]');
    $tile.css({'background-color': 'red'});
  }

  UI.prototype.refreshRender = function() {
    $('.notices').empty();
    $('.tile').empty();
    $('.tile').css({'background-color': '#cccccc'});
  }

  UI.prototype.tellPlayer = function(string) {
    $('.notices').html(string);
  }

  UI.prototype.validateSquare = function(x, y) {
    $tile = $('.tile[data-coords="[' + x + ',' + y + ']"]');
    if ($tile.hasClass('revealed')) {
      return true;
    }
    return false;
  }
})(this);