class Garden {
	// static get plants() { return this._plants || []; }
	// static set plants(p) { this._plants = p; }

	static getPlants() {
		return this.plants;
	}

	static addPlant() {
		if(!this.plants) this.plants = [];
		var marker = {};
	    marker.x = game.plantLayer.getTileX(game.input.activePointer.worldX) * 128;
	    marker.y = game.plantLayer.getTileY(game.input.activePointer.worldY) * 128;

		// adds at mouse position
		var p = new Plant(marker.x, marker.y);
		this.plants.push(p);
		console.log(this.plants);
	}
}

class Plant {
	// Health: 2 (growing!), 1 (wilting), or 0 (dead)
	get health() { return this._health || 2; }

	// get sprite() { return _sprite; }
	// set sprite(s) { _sprite = s; }

	constructor(x, y) {
	    var tile = game.map.getTile( 0, 0, game.plantLayer);

	    var tileX = game.plantLayer.getTileX(x); 
	   	var tileY = game.plantLayer.getTileY(y);

    	console.log("TILE", tileX, tileY, game.plantLayer);

        game.map.putTile(tile, tileX, tileY, game.plantLayer);

        this.sprite = game.add.sprite(x, y, 'plant');
        this.sprite.scale.setTo(8,8);

        this.planted = Date.now();

        // Update level
		game.pathfinder.updateGrid();     
	}

	updateHealthStatus() {
		console.log("update health");
		// runs daily, see if i'm dead
		if(this.health == 0) {
			this.sprite.alive = false;
		} else if(this.health == 1) {
			this.sprite.frame = 4;
		} else if(this.sprite.frame < 3) {
			this.sprite.frame += 1;

		}
	}
}