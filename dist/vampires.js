'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VampireManager = (function () {
	function VampireManager() {
		_classCallCheck(this, VampireManager);
	}

	_createClass(VampireManager, null, [{
		key: 'getVampires',

		// static get vampires() { return this._vampires || []; }
		// static set vampires(v) { this._vampires = v; }

		value: function getVampires() {
			if (!this.vampires) return [];
			return this.vampires;
		}
	}, {
		key: 'hireVampire',
		value: function hireVampire() {
			if (!this.vampires) this.vampires = [];

			this.vampires.push(new Vampire());
			console.log("HIRED", this.vampires);
		}
	}, {
		key: 'update',
		value: function update() {
			_.each(this.vampires, function (v) {
				// update vampire
				v.update();
			});
		}
	}]);

	return VampireManager;
})();

var Vampire = (function () {
	function Vampire() {
		_classCallCheck(this, Vampire);

		this.plantsToWater = [];
		this.paths = [];
		this.curPath = null;
		this.plantsToWaterIx = 0;
		this.waterLevel = 1;
		this.goingToFountain = false;
		this.id = _.uniqueId();

		this.pathIx = 1;
		for (var i = 0; i < 2 * Stats.efficiency; i++) {
			// pick some unwatered plants
			var plant = Garden.findUnassignedPlant();
			if (plant) {
				this.addPlant(plant);
			}
		}

		this.sprite = game.add.sprite(500, 200, 'vampire', 0, game.characterGroup);
		this.sprite.animations.add('walk', [0, 1], 8, true);

		//this.sprite.tint = 0x86bfda;
		this.sprite.anchor.set(0.5, 0.5);
		game.physics.arcade.enable(this.sprite);
		this.sprite.body.collideWorldBounds = true;

		this.speed = 100;
	}

	_createClass(Vampire, [{
		key: 'roomForPlants',
		value: function roomForPlants() {
			return !this.plantsToWater || this.plantsToWater.length < 2 * Stats.efficiency;
		}
	}, {
		key: 'addPlant',
		value: function addPlant(p) {
			p.assignVampire(this);
		}
	}, {
		key: 'setCurPath',
		value: function setCurPath(path) {

			this.curPath = path;
			this.findingPath = false;

			console.log("FOUND PATH 1", this.curPath);
		}
	}, {
		key: 'nextPath',
		value: function nextPath() {
			if (!this.curPath && !this.goingToFountain && this.plantsToWater.length > 0) {
				// should alternate watering with going to fountain
				// or maybe can water x plants before need refill...
				if (this.waterLevel <= 0) {
					// need to return to the fountain!
					this.goingToFountain = true;
					game.pathfinder.findPath(this, game.fountain, this.sprite.x, this.sprite.y, game.fountain.x, game.fountain.y);
				} else {
					this.goingToFountain = false;

					//get water plant path
					var p = this.plantsToWater[this.plantsToWaterIx];

					//console.log("NEXT PATH FOR VAMP", this.id, this);

					console.log("WATERING", this.plantsToWaterIx);

					if (this.plantsToWaterIx && this.plantsToWaterIx >= this.plantsToWater.length - 1) this.plantsToWaterIx = 0;else this.plantsToWaterIx++;

					if (p) {

						game.pathfinder.findPath(this, p, this.sprite.x, this.sprite.y, p.sprite.x, p.sprite.y);
					}
				}
			}
		}
	}, {
		key: 'update',
		value: function update() {
			//console.log("This vampires paths", this.paths);
			// cycle through paths
			//_.each(this.paths, function(path) {
			if (this.curPath) {
				this.findingPath = false;
				//console.log("WE HAVE A PATH");
				if (!this.pathIx) this.pathIx = 1;

				//console.log("PATH", this.curPath);

				var dir = game.pathfinder.getDirection(this.curPath.path, this.sprite, this.pathIx);
				//console.log("DIR", dir, this.sprite.body);

				if (dir == "N") {
					this.sprite.body.velocity.x = -this.speed;
					this.sprite.body.velocity.y = -this.speed;
				} else if (dir == "S") {
					this.sprite.body.velocity.x = this.speed;
					this.sprite.body.velocity.y = this.speed;
				} else if (dir == "E") {
					this.sprite.body.velocity.x = this.speed;
					this.sprite.body.velocity.y = -this.speed;
				} else if (dir == "W") {
					this.sprite.body.velocity.x = -this.speed;
					this.sprite.body.velocity.y = this.speed;
				} else if (dir == "SE") {
					this.sprite.body.velocity.x = this.speed;
					this.sprite.body.velocity.y = 0;
				} else if (dir == "NW") {
					this.sprite.body.velocity.x = -this.speed;
					this.sprite.body.velocity.y = 0;
				} else if (dir == "SW") {
					this.sprite.body.velocity.x = 0;
					this.sprite.body.velocity.y = this.speed;
				} else if (dir == "NE") {
					this.sprite.body.velocity.x = 0;
					this.sprite.body.velocity.y = -this.speed;
				} else if (dir == "STOP") {
					this.sprite.animations.stop();
					this.sprite.body.velocity.x = 0;
					this.sprite.body.velocity.y = 0;
				} else // JUST IN CASE IF dir wouldnt exist we stop the cowboy movement
					{
						this.sprite.body.velocity.x = 0;
						this.sprite.body.velocity.y = 0;
					}

				if (dir && dir != 'STOP') {
					this.sprite.animations.play("walk");
				} else if (dir == "STOP" && this.pathIx < this.curPath.path.length - 1) {
					this.pathIx++;
				} else if (dir == "STOP") {
					// END OF PATH
					//console.log("goingToFountain", this.goingToFountain);
					if (this.goingToFountain) {
						// REFILL WATER
						this.goingToFountain = false;
						this.waterLevel = 1;
					} else {
						this.curPath.destination.water();

						this.waterLevel--; //decreme
					}
					this.curPath = null;
					this.pathIx = 1;
				}
			} else if (!this.findingPath) {
				//console.log(this.id, this.plantsToWater.length, this.curPath);
				//this.findingPath = true;
				this.nextPath();
			}
			//}, this);

			// if(!this.curPath && this.paths.length == this.plantsToWater.length) {
			// 	// pick a path!
			// 	if(this.curPathIx >= this.paths.length - 1)
			// 		this.curPathIx = 0;
			// 	else
			// 		this.curPathIx ++;

			// 	this.curPath = this.paths[this.curPathIx];

			// } else if(this.paths.length <= 0 && this.plantsToWater.length > 0 && this.paths.length < this.plantsToWater.length) {
			// 	console.log("plantsToWater", this.plantsToWater);
			// 	//this.paths = [];
			// 	_.each(this.plantsToWater, function(p) {
			// 		if(!_.find(this.paths, function(path) { return path.destination.id == p.id; })) {
			// 			console.log("FIND A PATH FORRRRRR", p, this.sprite.x, this.sprite.y, p.sprite.x, p.sprite.y);
			// 			game.pathfinder.findPath(this, p, this.sprite.x, this.sprite.y, p.sprite.x, p.sprite.y);
			// 		}
			// 	}, this);

			// 	//console.log("curpath", this.paths);

			// }
		}
	}]);

	return Vampire;
})();