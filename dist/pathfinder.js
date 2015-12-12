"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pathfinder = (function () {
  // get easystar() { return _easystar || []; }
  // set easystar(e) { _easystar = e; }

  function Pathfinder() {
    _classCallCheck(this, Pathfinder);

    this.easystar = new EasyStar.js();

    this.easystar.setIterationsPerCalculation(1000);

    this.easystar.setAcceptableTiles([2]);
    //this.easystar.enableCornerCutting();
    this.easystar.enableDiagonals();
  }

  _createClass(Pathfinder, [{
    key: "updateGrid",
    value: function updateGrid() {
      var level = _.chunk(game.map.layers[0].data, game.map.width);
      this.easystar.setGrid(level);

      // Need to update everyone's paths?
    }
  }, {
    key: "getDirection",
    value: function getDirection(path) {
      var ix = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

      if (path) {
        currentNextPointX = path[ix].x;
        currentNextPointY = path[ix].y;
      }
      if (currentNextPointX < game.character.x && currentNextPointY < game.character.y) {
        // left up
        console.log("GO LEFT UP");
        return "NW";
      } else if (currentNextPointX == game.character.x && currentNextPointY < game.character.y) {
        // up
        console.log("GO UP");
        return "N";
      } else if (currentNextPointX > game.character.x && currentNextPointY < game.character.y) {
        // right up
        console.log("GO RIGHT UP");
        return "NE";
      } else if (currentNextPointX < game.character.x && currentNextPointY == game.character.y) {
        // left
        console.log("GO LEFT");
        return "W";
      } else if (currentNextPointX > game.character.x && currentNextPointY == game.character.y) {
        // right
        console.log("GO RIGHT");
        return "E";
      } else if (currentNextPointX > game.character.x && currentNextPointY > game.character.y) {
        // right down
        console.log("GO RIGHT DOWN");
        return "SE";
      } else if (currentNextPointX == game.character.x && currentNextPointY > game.character.y) {
        // down
        console.log("GO DOWN");
        return "S";
      } else if (currentNextPointX < game.character.x && currentNextPointY > game.character.y) {
        // left down
        console.log("GO LEFT DOWN");
        return "SW";
      } else {
        return "STOP";
      }
    }
  }, {
    key: "findPath",
    value: function findPath(entity, entityPathName, fromX, fromY, toX, toY) {
      var fromTileX = Math.floor(fromX / 128);
      var fromTileY = Math.floor(fromY / 128);
      var targetTileX = Math.floor(toX / 128);
      var targetTileY = Math.floor(toY / 128);

      var currentNextPointX, currentNextPointY;

      this.easystar.findPath(fromTileX, fromTileY, targetTileX, targetTileY, function (path) {
        if (path === null) {
          console.log("The path to the destination point was not found.");
        }

        if (path) {
          entity.paths[entityPathName] = path;
          console.log(path);

          currentNextPointX = path[1].x;
          currentNextPointY = path[1].y;
        }

        // if (enemyDirection != "STOP") cowboy.animations.play(enemyDirection);
      });
      this.easystar.calculate();
    }
  }]);

  return Pathfinder;
})();