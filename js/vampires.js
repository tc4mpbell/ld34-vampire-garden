class VampireManager {
	// static get vampires() { return this._vampires || []; }
	// static set vampires(v) { this._vampires = v; }

	static getVampires() {
		if(!this.vampires) return [];
		return this.vampires;
	}

    static hireVampire() {
    	if(!this.vampires) this.vampires = [];

    	this.vampires.push(new Vampire());
    	console.log("HIRED", this.vampires);
    }

	static update() {
		_.each(this.vampires, function(v) {
			// update vampire
			v.update();
		});
	}
}

class Vampire {
	constructor() {
		this.plantsToWater = [];
		this.paths = [];
		this.curPath = null;

		this.pathIx = 1;
		for(var i = 0; i < 2 * Stats.efficiency; i++) {
			// pick some unwatered plants
			var plant = Garden.findUnassignedPlant();
			this.plantsToWater.push(plant);
		}

		this.sprite = game.add.sprite(128, 64+128, 'vampire', 0);
		this.sprite.animations.add('walk', [0, 1], 8, true);

		this.sprite.tint = 0x86bfda;
		this.sprite.anchor.set(0.5);
		game.physics.arcade.enable(this.sprite);
		this.sprite.body.collideWorldBounds = true;

		this.speed = 100;
	}

	update() {
		// cycle through paths
		//_.each(this.paths, function(path) {
		if(this.curPath) {
			if(!this.pathIx) this.pathIx = 1;

			console.log("PATH", this.curPath);

			var dir = game.pathfinder.getDirection(this.curPath.path, this.sprite, this.pathIx);
			console.log("DIR", dir, this.sprite.body);

			if (dir == "N") {
	        	this.sprite.body.velocity.x = -this.speed;
	        	this.sprite.body.velocity.y = -this.speed;
	        }
	        else if (dir == "S")
	        {
	        	this.sprite.body.velocity.x = this.speed;
	        	this.sprite.body.velocity.y = this.speed;
	        }
	        else if (dir == "E") {
	        	this.sprite.body.velocity.x = this.speed;
	        	this.sprite.body.velocity.y = -this.speed;
	        }
	        else if (dir == "W")
	        {
	        	this.sprite.body.velocity.x = -this.speed;
	        	this.sprite.body.velocity.y = this.speed;
	        }
	        else if (dir == "SE")
	        {
	        	this.sprite.body.velocity.x = this.speed;
	        	this.sprite.body.velocity.y = 0;
	        }
	        else if (dir == "NW")
	        {
	        	this.sprite.body.velocity.x = -this.speed;
	        	this.sprite.body.velocity.y = 0;   	
	        }
	        else if (dir == "SW")
	        {
	        	this.sprite.body.velocity.x = 0;
	        	this.sprite.body.velocity.y = this.speed;    	
	        }
	       
	        else if (dir == "NE")
	        {
	        	this.sprite.body.velocity.x = 0;
	        	this.sprite.body.velocity.y = -this.speed;
	        }
	        else if (dir == "STOP")
	        {
	        	this.sprite.body.velocity.x = 0;
	        	this.sprite.body.velocity.y = 0;
	        }
	        else // JUST IN CASE IF dir wouldnt exist we stop the cowboy movement
	        {
	        	this.sprite.body.velocity.x = 0;
	        	this.sprite.body.velocity.y = 0;
	        }

	        if(dir == "STOP" && this.pathIx < this.curPath.path.length - 1) {
		        this.pathIx ++;
		    } else if(dir == "STOP") {
		    	// END OF PATH
		    	this.curPath.destination.water();
		    }
		}
		//}, this);

		if(!this.curPath && this.paths.length > 0) {
			// pick a path!
			this.curPath = this.paths.pop();
		} else if(this.paths.length <= 0 && this.plantsToWater.length > 0) {
			_.each(this.plantsToWater, function(p) {
				game.pathfinder.findPath(this, p, this.sprite.x, this.sprite.y, p.sprite.x, p.sprite.y);
			}, this);
		}
	}

}