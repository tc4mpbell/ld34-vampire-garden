class VampireManager {
	static get vampires() { return this._vampires || []; }

    static hireVampire() {
    	this.vampires << new Vampire();
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
		for(var i = 0; i < 2 * Stats.efficiency; i++) {
			// pick some unwatered plants
			var plant = Garden.findUnassignedPlant();
			this.plantsToWater << plant;
		}
	}

	update() {
		// cycle through paths
		_.each(this.paths, function(path) {
			
		});
	}

	water(plant) {

	}


}