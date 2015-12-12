class Pathfinder {
	// get easystar() { return _easystar || []; }
	// set easystar(e) { _easystar = e; }

	constructor() {
		this.easystar = new EasyStar.js();

		this.easystar.setIterationsPerCalculation(1000); 

		this.easystar.setAcceptableTiles([2]);
		//this.easystar.enableCornerCutting();
		this.easystar.enableDiagonals();

    this.updateGrid();
	}	

	updateGrid() {
    if(game.map) {
  		var level = _.chunk(game.map.layers[0].data, game.map.width);
      level = _.map(level[0], function(row) {
        var mapped = _.map(row, function(c) {
          return c.index;
        });
        return mapped;
      });
  		this.easystar.setGrid(level);
    }

		// Need to update everyone's paths?
	}


	getDirection(path, sprite, ix=1) {
    var spriteTileX = Math.floor(sprite.x/128);
    var spriteTileY =  Math.floor(sprite.y/128);
    // var targetTileX = Math.floor(toX/128);
    // var targetTileY = Math.floor(toY/128);

    var currentNextPointX, currentNextPointY;
		if (path) {
          console.log("Get getDirection", path, ix);
        	currentNextPointX = path[ix].x;
          currentNextPointY = path[ix].y;
    }

      console.log(currentNextPointX, spriteTileX, currentNextPointY, spriteTileY);

      if (currentNextPointX < spriteTileX && currentNextPointY < spriteTileY)
      {
        // left up
          console.log("GO LEFT UP");
          return "NW";
      }
      else if (currentNextPointX == spriteTileX && currentNextPointY < spriteTileY)
      {
        // up
          console.log("GO UP");
          return "N";
        }
      else if (currentNextPointX > spriteTileX && currentNextPointY < spriteTileY)
      {
        // right up
          console.log("GO RIGHT UP");
          return "NE";
        }
      else if (currentNextPointX < spriteTileX && currentNextPointY == spriteTileY)
      {
        // left
          console.log("GO LEFT");
          return "W";
        }
      else if (currentNextPointX > spriteTileX && currentNextPointY == spriteTileY)
      {
        // right
          console.log("GO RIGHT");
          return "E";
      }
      else if (currentNextPointX > spriteTileX && currentNextPointY > spriteTileY)
      {
        // right down
          console.log("GO RIGHT DOWN");
          return "SE";
        }
      else if (currentNextPointX == spriteTileX && currentNextPointY > spriteTileY)
      {
        // down
          console.log("GO DOWN");
          return "S";
        }
      else if (currentNextPointX < spriteTileX && currentNextPointY > spriteTileY)
      {
        // left down
          console.log("GO LEFT DOWN");
          return "SW";
        }
      else
      {
          return "STOP";
      }
	}


	findPath(entity, entityDestination, fromX,fromY, toX, toY) {
		var fromTileX = Math.floor(fromX/128);
		var fromTileY =  Math.floor(fromY/128);
		var targetTileX = Math.floor(toX/128);
		var targetTileY = Math.floor(toY/128);

    console.log(fromTileY, fromTileY, targetTileX, targetTileY);


		this.easystar.findPath(fromTileX, fromTileY, targetTileX, targetTileY, function( path ) {
            if (path === null) {
                console.log("The path to the destination point was not found.");
            } 

            if (path) {
              var pathObj = {
                destination: entityDestination,
                path: path
              };
	        	  entity.paths.push(pathObj); //[entityPathName] = path;
	          	console.log(pathObj);
	        }
            
            // if (enemyDirection != "STOP") cowboy.animations.play(enemyDirection);
        });
        this.easystar.calculate();
	}
}