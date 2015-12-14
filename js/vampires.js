class VampireManager {
	static get pendingVampires() { return this._pendingVampires || 0; }
	static set pendingVampires(v) { this._pendingVampires = v; }

	static vampireCount() {
		if(!this.vampCount) this.vampCount = 0;

		return this.vampCount + this.pendingVampires;
	}

	static getVampires() {
		if(!this.vampires) return [];
		return this.vampires;
	}

	static bringPendingVampiresToLife() {
    	if(!this.vampires) this.vampires = [];

		if(this.pendingVampires) {
			for(var i = 0; i<this.pendingVampires; i++) {
				this.vampires.push(new Vampire());
				this.vampCount += 1;
				Stats.unrest ++;
			}
			this.pendingVampires = 0;
    		console.log("HIRED", this.vampires);

		}
	}

    static hireVampire() {
    	if(Stats.money >= 10) {
	    	if(!this.pendingVampires) this.pendingVampires = 0;

	    	this.pendingVampires++;
	    	Stats.subtractMoney(10);
	    }
    }

    static allRunAway() {
    	this.vampCount = this.vampires.length;
    	// make sure no plants are assigned.
		_.each(Garden.plants, function(p) {
			p.vampire = null;
		});
		
    	_.each(_.clone(this.vampires), function(v) {
    		if(v) {
    			_.each(v.plantsToWater, function(p) {
    				p.vampire = null;
    			})
    			

	    		_.remove(this.vampires, {id: v.id});
	    		game.emitter = game.add.emitter(v.sprite.x, v.sprite.y, 100);
		    	game.emitter.makeParticles('water');
		    	game.emitter.gravity = 100;
		    	game.emitter.forEach(function(particle) {
				  // tint every particle red
				  particle.tint = 0xffaaaa;
				});
		    	game.emitter.start(true, 300, null, 20);
		    	v.sprite.destroy();
		    }

    	}, this);
   	}

   	static awakenAll() {

   		for(var i = 0; i< this.vampCount; i++) {
    		this.vampires.push(new Vampire());
    	}
   	}

	static update() {
		_.each(this.vampires, function(v) {
			// update vampire
			v.update();
		});

		if(DayManager.state == 'NIGHT') {
			this.bringPendingVampiresToLife();
		}
	}
}

class Vampire extends WalkingSprite {
	constructor() {
		super();
		this.reset();

		this.id = _.uniqueId();

		this.sprite = game.add.sprite(_.random(32*20, 32*25), 5, 'vampire', 0, game.characterGroup);
		this.sprite.animations.add('walk', [0, 1], 8, true);

		//this.sprite.tint = 0x86bfda;
		this.sprite.anchor.set(0, 1);
		game.physics.arcade.enable(this.sprite);
		this.sprite.body.collideWorldBounds = true;

		//this.sprite.body.bounce.setTo(1, 1);
		this.speed = 350;
	}

	reset() {
		this.plantsToWater = [];
		this.paths = [];
		this.curPath = null;
		this.plantsToWaterIx = 0;
		this.waterLevel = 3;
		this.goingToFountain = false;
		this.pathIx = 1;

		// for(var i = 0; i < 2 * Stats.efficiency; i++) {
		// 	// pick some unwatered plants
		// 	var plant = Garden.findUnassignedPlant();
		// 	if(plant) {
		// 		this.addPlant(plant);
		// 	}
		// }
	}

	water(plant) {
		plant.water();
	    this.waterLevel -= 1;
	    if(plant.vampire) plant.vampire = null;
	    
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

	// addPlant(p) {
	// 	//p.assignVampire(this);
	// }

	setCurPath(path) {
		this.curPath = path;
		this.findingPath = false;

		console.log("FOUND PATH 1", this.curPath);
	}

	pathFailed() {
		this.findingPath = false;
		this.curPath = false; 
		this.goingToFountain = false;
		this.waterLevel = 1;
		this.sprite.body.velocity.x = 0;
		this.sprite.body.velocity.y = 0;
		this.sprite.x += 10;
		this.nextPath();

	}

	collideWithFountain() {
		var that = this;
		this.curPath = null;
		setTimeout(function() {	
			// REFILL WATER
			Notify.log("Refilling water!");
			console.log("REFILLING)");
			that.goingToFountain = false;
			that.findingPath = false;
			that.waterLevel = 3;
		}, 1000);
	}

	nextPath() {
		// make sure.
		_.each(_.filter(Garden.plants, {vampire: this}), function(p) {
			p.vampire = null;
		});

		console.log("next Path", !this.findingPath, !this.curPath, !this.goingToFountain);//, this.plantsToWater.length > 0);
		if(!this.findingPath && !this.curPath && !this.goingToFountain) { //} && this.plantsToWater.length > 0) {
			// should alternate watering with going to fountain
			// or maybe can water x plants before need refill...
			if(this.waterLevel <= 0) {
				// need to return to the fountain!
				this.waterLevel = 0;
				this.goingToFountain = true;
				console.log("WATER PATH:", game.fountain.x + game.fountain.width +1, game.fountain.y + game.fountain.height / 2);
				game.pathfinder.findPath(this, game.fountain, this.sprite.x, this.sprite.y, game.fountain.x + game.fountain.width +1, game.fountain.y + game.fountain.height / 2);
			} else {				
				//get water plant path
				var p = Garden.findUnassignedPlant(); //this.plantsToWater[this.plantsToWaterIx];

				if(this.plantsToWaterIx && this.plantsToWaterIx >= this.plantsToWater.length - 1)
					this.plantsToWaterIx = 0;
				else
					this.plantsToWaterIx++;

				if(p) {
					p.vampire = this;
					game.pathfinder.findPath(this, p, this.sprite.x, this.sprite.y, p.sprite.x, p.sprite.y);
				} else {
					console.log("COULDN'T FIND PLANT");
				}
			}
		} 
	}

	afterPath() {
		// END OF PATH
		//console.log("goingToFountain", this.goingToFountain);
		if(this.goingToFountain) {
			this.collideWithFountain();
		} else {
			this.water(this.curPath.destination);
	    }
	}
}