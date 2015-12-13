class VampireManager {
	// static get vampires() { return this._vampires || []; }
	// static set vampires(v) { this._vampires = v; }

	static getVampires() {
		if(!this.vampires) return [];
		return this.vampires;
	}

	static bringPendingVampiresToLife() {
    	if(!this.vampires) this.vampires = [];

		if(this.pendingVampires) {
			for(var i = 0; i<this.pendingVampires; i++) {
				this.vampires.push(new Vampire());
			}
			this.pendingVampires = 0;
    		console.log("HIRED", this.vampires);

		}
	}

    static hireVampire() {
    	if(!this.pendingVampires) this.pendingVampires = 0;

    	this.pendingVampires++;
    }

	static update() {
		_.each(this.vampires, function(v) {
			// update vampire
			v.update();
		});
	}
}

class Vampire extends WalkingSprite {
	constructor() {
		super();
		this.plantsToWater = [];
		this.paths = [];
		this.curPath = null;
		this.plantsToWaterIx = 0;
		this.waterLevel = 1;
		this.goingToFountain = false;
		this.id = _.uniqueId();

		this.pathIx = 1;
		for(var i = 0; i < 2 * Stats.efficiency; i++) {
			// pick some unwatered plants
			var plant = Garden.findUnassignedPlant();
			if(plant) {
				this.addPlant(plant);
			}
		}

		this.sprite = game.add.sprite(500, 200, 'vampire', 0, game.characterGroup);
		this.sprite.animations.add('walk', [0, 1], 8, true);

		//this.sprite.tint = 0x86bfda;
		this.sprite.anchor.set(1, 1);
		game.physics.arcade.enable(this.sprite);
		this.sprite.body.collideWorldBounds = true;

		this.sprite.body.bounce.setTo(1, 1);

		this.speed = 200;
	}

	water(plant) {
		plant.water();
	    this.waterLevel -= 1;
	    
	    //  Position the emitter where the mouse/touch event was
	    console.log(game.emitter);
	    game.emitter.x = this.sprite.x;
	    game.emitter.y = this.sprite.y;

	    //  The first parameter sets the effect to "explode" which means all particles are emitted at once
	    //  The second gives each particle a 2000ms lifespan
	    //  The third is ignored when using burst/explode mode
	    //  The final parameter (10) is how many particles will be emitted in this single burst
	    game.emitter.start(true, 500, null, 10);

	}

	roomForPlants() {
		return !this.plantsToWater || this.plantsToWater.length < 2 * Stats.efficiency;
	}

	addPlant(p) {
		p.assignVampire(this);
	}

	setCurPath(path) {
		this.curPath = path;
		this.findingPath = false;

		console.log("FOUND PATH 1", this.curPath);
	}

	nextPath() {
		if(!this.findingPath && !this.curPath && !this.goingToFountain && this.plantsToWater.length > 0) {
			// should alternate watering with going to fountain
			// or maybe can water x plants before need refill...
			if(this.waterLevel <= 0) {
				// need to return to the fountain!
				this.waterLevel = 0;
				this.goingToFountain = true;
				game.pathfinder.findPath(this, game.fountain, this.sprite.x, this.sprite.y, game.fountain.x + game.fountain.width +1, game.fountain.y + game.fountain.height +1);
			} else {				
				//get water plant path
				var p = this.plantsToWater[this.plantsToWaterIx];

				if(this.plantsToWaterIx && this.plantsToWaterIx >= this.plantsToWater.length - 1)
					this.plantsToWaterIx = 0;
				else
					this.plantsToWaterIx++;

				if(p) {
					game.pathfinder.findPath(this, p, this.sprite.x, this.sprite.y, p.sprite.x, p.sprite.y);
				}
			}
		} 
	}

	afterPath() {
		// END OF PATH
		//console.log("goingToFountain", this.goingToFountain);
		if(this.goingToFountain) {
			var that = this;
			setTimeout(function() {	
				// REFILL WATER
				console.log("REFILLING)");
				that.goingToFountain = false;
				that.waterLevel = 1;
			}, 1000);
		} else {
			this.water(this.curPath.destination);
	    }
	}
}