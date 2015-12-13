class Garden {
	// static get plants() { return this._plants || []; }
	// static set plants(p) { this._plants = p; }

	static getPlants() {
		return this.plants;
	}

	static getLivePlants() {
		return _.filter(this.plants, function(p) {
			return p.sprite.alive;
		});
	}


	// TODO
	static findUnassignedPlant() {
		//console.log("All plants", this.plants);
		return _.find(this.plants, function(p) { return p.vampire == null && p.health > 0; });
	}

	static addPlant() {
		if(!this.plants) this.plants = [];
		if(!this.plantMap) this.plantMap = {}; //stores locs where plants are in this game

		var marker = {};
		marker.x = game.plantLayer.getTileX(game.input.activePointer.worldX) * game.tileSize;
		marker.y = game.plantLayer.getTileY(game.input.activePointer.worldY) * game.tileSize;

		if(this.validPlantPos(marker.x, marker.y)) {
			// adds at mouse position
			var p = new Plant(marker.x, marker.y);
			this.plants.push(p);
			console.log(this.plants);
			this.plantMap[marker.x + "-" + marker.y] = true;
		}
	}

	static validPlantPos(x, y) {
		if(!this.plantMap) this.plantMap = {}; //stores locs where plants are in this game

		if(this.plantMap[x + "-" + y] || game.fountain.body.hitTest(game.input.activePointer.worldX, game.input.activePointer.worldY)) {
			console.log("NO");
			return false;
		} else {
			return true;
		}
	}

	static highlightTile(x, y) {
		if(!this.highlighting) this.highlighting = {}; 

		var mx = game.plantLayer.getTileX(x)*game.tileSize;
		var my = game.plantLayer.getTileX(y)*game.tileSize;

		if(!this.highlighting[x + "-" + y] && this.validPlantPos(mx, my)) {
	        game.highlightedTile = game.add.graphics(0, 0);
	        game.highlightedTile.beginFill("0xffffff", 0.4);
	        game.highlightedTile.drawRect(mx, my, game.tileSize, game.tileSize);
	        game.highlightedTile.alpha = 0;
	        game.highlightedTile.endFill();

	        this.highlighting[x + "-" + y] = true;

	        var s = game.add.tween(game.highlightedTile);
	        s.to({ alpha: 0.1 }, 200, null, true, 0, 0, true);
	        s.start();

	        game.groundGroup.add(game.highlightedTile);
	    }
	}
}

class Plant {
	// Health: 2 (growing!), 1 (wilting), or 0 (dead)
	get health() { return this._health; }
	set health(h) { this._health = h; }

	// get sprite() { return _sprite; }
	// set sprite(s) { _sprite = s; }

	constructor(x, y) {
		this.id = _.uniqueId("plant");
		this.health = 3;
		this.vampire = null;

	    // var tileX = game.plantLayer.getTileX(x); 
	   	// var tileY = game.plantLayer.getTileY(y);
    	//console.log("TILE", tileX, tileY, game.plantLayer);
        //game.map.putTile(tile, tileX, tileY, game.plantLayer);

        this.sprite = game.add.sprite(x, y, 'plant',0, game.groundGroup);
        this.sprite.scale.setTo(6,6);

        this.planted = Date.now();

        // Update level
		game.pathfinder.updateGrid();     

		this.assignVampire();
	}

	isAssignedToVampire() {
		return this.vampire;
	}

	assignVampire(v) {
		if(v) {
			this.vampire = v;
		} else {
			// no vamp passed, find one that has a slot
			v = _.find(VampireManager.getVampires(), function(v) {
				return v.roomForPlants();
			});
			this.vampire = v;			
		}

		if(this.vampire) {
			this.vampire.plantsToWater.push(this);
			console.log("my vampire", this.vampire);
		}
	}

	kill() {
		if(this.vampire) {
			_.remove(this.vampire.plantsToWater, {id: this.id});
			this.vampire = null;
		}

		this.sprite.alive = false;
		this.sprite.frame = 6;
		console.log("dead");
	}

	water() {
		if(this.sprite.alive) {
			console.log("Watered", this);
			this.health = 4;
			this.sprite.frame = 2;
			this.updateHealthStatus();
			
		}
	}

	updateHealthStatus() {
		console.log("update health", this.health);
		// runs daily, see if i'm dead
		if(this.health <= 0) {
			this.kill();
		} else {
			if(this.health == 1) {
				console.log("dying");
				this.sprite.frame = 5;
			} else if(this.sprite.frame < 4) {
				console.log("alive", this.sprite.frame);
				this.sprite.frame += 1;
			}

			this.health -= 1;
		}
	}
}