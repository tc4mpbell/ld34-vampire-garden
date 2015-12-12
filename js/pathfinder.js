class Pathfinder {
	// get easystar() { return _easystar || []; }
	// set easystar(e) { _easystar = e; }

	constructor() {
		this.easystar = new EasyStar.js();

		this.easystar.setIterationsPerCalculation(1000); 

		this.easystar.setAcceptableTiles([2]);
		//this.easystar.enableCornerCutting();
		this.easystar.enableDiagonals();
	}	

	updateGrid() {
		var level = _.chunk(game.map.layers[0].data, game.map.width);
		this.easystar.setGrid(level);

		// Need to update everyone's paths?
	}


	getDirection(path, ix=1) {
		if (path) {
          	currentNextPointX = path[ix].x;
            currentNextPointY = path[ix].y;
        }
        if (currentNextPointX < game.character.x && currentNextPointY < game.character.y)
        {
          // left up
            console.log("GO LEFT UP");
            return "NW";
        }
        else if (currentNextPointX == game.character.x && currentNextPointY < game.character.y)
        {
          // up
            console.log("GO UP");
            return "N";
          }
        else if (currentNextPointX > game.character.x && currentNextPointY < game.character.y)
        {
          // right up
            console.log("GO RIGHT UP");
            return "NE";
          }
        else if (currentNextPointX < game.character.x && currentNextPointY == game.character.y)
        {
          // left
            console.log("GO LEFT");
            return "W";
          }
        else if (currentNextPointX > game.character.x && currentNextPointY == game.character.y)
        {
          // right
            console.log("GO RIGHT");
            return "E";
        }
        else if (currentNextPointX > game.character.x && currentNextPointY > game.character.y)
        {
          // right down
            console.log("GO RIGHT DOWN");
            return "SE";
          }
        else if (currentNextPointX == game.character.x && currentNextPointY > game.character.y)
        {
          // down
            console.log("GO DOWN");
            return "S";
          }
        else if (currentNextPointX < game.character.x && currentNextPointY > game.character.y)
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


	findPath(entity, entityPathName, fromX,fromY, toX, toY) {
		var fromTileX = Math.floor(fromX/128);
		var fromTileY =  Math.floor(fromY/128);
		var targetTileX = Math.floor(toX/128);
		var targetTileY = Math.floor(toY/128);

		var currentNextPointX, currentNextPointY;

		this.easystar.findPath(fromTileX, fromTileY, targetTileX, targetTileY, function( path ) {
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
}