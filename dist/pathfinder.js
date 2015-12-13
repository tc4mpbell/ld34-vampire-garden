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

    this.easystar.setAcceptableTiles([1]);
    //this.easystar.enableCornerCutting();
    this.easystar.enableDiagonals();

    this.updateGrid();
  }

  _createClass(Pathfinder, [{
    key: "updateGrid",
    value: function updateGrid() {
      if (game.map) {
        var level = _.chunk(game.map.layers[0].data, game.map.width);
        level = _.map(level[0], function (row) {
          var mapped = _.map(row, function (c) {
            return c.index;
          });
          return mapped;
        });
        this.easystar.setGrid(level);
      }

      // Need to update everyone's paths?
    }
  }, {
    key: "getDirection",
    value: function getDirection(path, sprite) {
      var ix = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

      var spriteTileX = Math.floor(sprite.x / 128);
      var spriteTileY = Math.floor(sprite.y / 128);
      // var targetTileX = Math.floor(toX/128);
      // var targetTileY = Math.floor(toY/128);

      var currentNextPointX, currentNextPointY;
      if (path) {
        //console.log("Get getDirection", path, ix);
        currentNextPointX = path[ix].x;
        currentNextPointY = path[ix].y;
      }

      //console.log(currentNextPointX, spriteTileX, currentNextPointY, spriteTileY);

      if (currentNextPointX < spriteTileX && currentNextPointY < spriteTileY) {
        // left up
        //console.log("GO LEFT UP");
        return "NW";
      } else if (currentNextPointX == spriteTileX && currentNextPointY < spriteTileY) {
        // up
        //console.log("GO UP");
        return "N";
      } else if (currentNextPointX > spriteTileX && currentNextPointY < spriteTileY) {
        // right up
        //console.log("GO RIGHT UP");
        return "NE";
      } else if (currentNextPointX < spriteTileX && currentNextPointY == spriteTileY) {
        // left
        //console.log("GO LEFT");
        return "W";
      } else if (currentNextPointX > spriteTileX && currentNextPointY == spriteTileY) {
        // right
        //console.log("GO RIGHT");
        return "E";
      } else if (currentNextPointX > spriteTileX && currentNextPointY > spriteTileY) {
        // right down
        //console.log("GO RIGHT DOWN");
        return "SE";
      } else if (currentNextPointX == spriteTileX && currentNextPointY > spriteTileY) {
        // down
        //console.log("GO DOWN");
        return "S";
      } else if (currentNextPointX < spriteTileX && currentNextPointY > spriteTileY) {
        // left down
        //console.log("GO LEFT DOWN");
        return "SW";
      } else {
        return "STOP";
      }
    }
  }, {
    key: "findPath",
    value: function findPath(entity, entityDestination, fromX, fromY, toX, toY) {
      var fromTileX = Math.floor(fromX / 128);
      var fromTileY = Math.floor(fromY / 128);
      var targetTileX = Math.floor(toX / 128);
      var targetTileY = Math.floor(toY / 128);

      //console.log(fromTileY, fromTileY, targetTileX, targetTileY);

      this.easystar.findPath(fromTileX, fromTileY, targetTileX, targetTileY, function (path) {
        if (path === null) {
          console.log("The path to the destination point was not found.");
        }

        if (path && path.length > 0) {
          var pathObj = {
            destination: entityDestination,
            path: path
          };
          console.log("CALLING", entity.setCurPath, path);
          entity.setCurPath(pathObj); //.paths.push(pathObj); //[entityPathName] = path;
          //entity.paths.push(pathObj); //[entityPathName] = path;
        }

        // if (enemyDirection != "STOP") cowboy.animations.play(enemyDirection);
      });
      this.easystar.calculate();
    }
  }]);

  return Pathfinder;
})();