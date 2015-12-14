'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VampireManager = (function () {
	function VampireManager() {
		_classCallCheck(this, VampireManager);
	}

	_createClass(VampireManager, null, [{
		key: 'vampireCount',
		value: function vampireCount() {
			if (!this.vampCount) this.vampCount = 0;

			return this.vampCount + this.pendingVampires;
		}
	}, {
		key: 'getVampires',
		value: function getVampires() {
			if (!this.vampires) return [];
			return this.vampires;
		}
	}, {
		key: 'bringPendingVampiresToLife',
		value: function bringPendingVampiresToLife() {
			if (!this.vampires) this.vampires = [];

			if (this.pendingVampires) {
				for (var i = 0; i < this.pendingVampires; i++) {
					this.vampires.push(new Vampire());
					this.vampCount += 1;
					Stats.unrest++;
				}
				this.pendingVampires = 0;
				console.log("HIRED", this.vampires);
			}
		}
	}, {
		key: 'hireVampire',
		value: function hireVampire() {
			if (Stats.money >= 10) {
				if (!this.pendingVampires) this.pendingVampires = 0;

				this.pendingVampires++;
				Stats.subtractMoney(10);
			}
		}
	}, {
		key: 'allRunAway',
		value: function allRunAway() {
			this.vampCount = this.vampires.length;
			// make sure no plants are assigned.
			_.each(Garden.plants, function (p) {
				p.vampire = null;
			});

			_.each(_.clone(this.vampires), function (v) {
				if (v) {
					_.each(v.plantsToWater, function (p) {
						p.vampire = null;
					});

					_.remove(this.vampires, { id: v.id });
					game.emitter = game.add.emitter(v.sprite.x, v.sprite.y, 100);
					game.emitter.makeParticles('water');
					game.emitter.gravity = 100;
					game.emitter.forEach(function (particle) {
						// tint every particle red
						particle.tint = 0xffaaaa;
					});
					game.emitter.start(true, 300, null, 20);
					v.sprite.destroy();
				}
			}, this);
		}
	}, {
		key: 'awakenAll',
		value: function awakenAll() {

			for (var i = 0; i < this.vampCount; i++) {
				this.vampires.push(new Vampire());
			}
		}
	}, {
		key: 'update',
		value: function update() {
			_.each(this.vampires, function (v) {
				// update vampire
				v.update();
			});

			if (DayManager.state == 'NIGHT') {
				this.bringPendingVampiresToLife();
			}
		}
	}, {
		key: 'pendingVampires',
		get: function get() {
			return this._pendingVampires || 0;
		},
		set: function set(v) {
			this._pendingVampires = v;
		}
	}]);

	return VampireManager;
})();

var Vampire = (function (_WalkingSprite) {
	_inherits(Vampire, _WalkingSprite);

	function Vampire() {
		_classCallCheck(this, Vampire);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Vampire).call(this));

		_this.reset();

		_this.id = _.uniqueId();

		_this.sprite = game.add.sprite(_.random(32 * 20, 32 * 25), 5, 'vampire', 0, game.characterGroup);
		_this.sprite.animations.add('walk', [0, 1], 8, true);

		//this.sprite.tint = 0x86bfda;
		_this.sprite.anchor.set(0, 1);
		game.physics.arcade.enable(_this.sprite);
		_this.sprite.body.collideWorldBounds = true;

		//this.sprite.body.bounce.setTo(1, 1);
		_this.speed = 350;
		return _this;
	}

	_createClass(Vampire, [{
		key: 'reset',
		value: function reset() {
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
	}, {
		key: 'water',
		value: function water(plant) {
			plant.water();
			this.waterLevel -= 1;
			if (plant.vampire) plant.vampire = null;

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
	}, {
		key: 'roomForPlants',
		value: function roomForPlants() {
			return !this.plantsToWater || this.plantsToWater.length < 2 * Stats.efficiency;
		}

		// addPlant(p) {
		// 	//p.assignVampire(this);
		// }

	}, {
		key: 'setCurPath',
		value: function setCurPath(path) {
			this.curPath = path;
			this.findingPath = false;

			console.log("FOUND PATH 1", this.curPath);
		}
	}, {
		key: 'pathFailed',
		value: function pathFailed() {
			this.findingPath = false;
			this.curPath = false;
			this.goingToFountain = false;
			this.waterLevel = 1;
			this.sprite.body.velocity.x = 0;
			this.sprite.body.velocity.y = 0;
			this.sprite.x += 10;
			this.nextPath();
		}
	}, {
		key: 'collideWithFountain',
		value: function collideWithFountain() {
			var that = this;
			this.curPath = null;
			setTimeout(function () {
				// REFILL WATER
				Notify.log("Refilling water!");
				console.log("REFILLING)");
				that.goingToFountain = false;
				that.findingPath = false;
				that.waterLevel = 3;
			}, 1000);
		}
	}, {
		key: 'nextPath',
		value: function nextPath() {
			// make sure.
			_.each(_.filter(Garden.plants, { vampire: this }), function (p) {
				p.vampire = null;
			});

			console.log("next Path", !this.findingPath, !this.curPath, !this.goingToFountain); //, this.plantsToWater.length > 0);
			if (!this.findingPath && !this.curPath && !this.goingToFountain) {
				//} && this.plantsToWater.length > 0) {
				// should alternate watering with going to fountain
				// or maybe can water x plants before need refill...
				if (this.waterLevel <= 0) {
					// need to return to the fountain!
					this.waterLevel = 0;
					this.goingToFountain = true;
					console.log("WATER PATH:", game.fountain.x + game.fountain.width + 1, game.fountain.y + game.fountain.height / 2);
					game.pathfinder.findPath(this, game.fountain, this.sprite.x, this.sprite.y, game.fountain.x + game.fountain.width + 1, game.fountain.y + game.fountain.height / 2);
				} else {
					//get water plant path
					var p = Garden.findUnassignedPlant(); //this.plantsToWater[this.plantsToWaterIx];

					if (this.plantsToWaterIx && this.plantsToWaterIx >= this.plantsToWater.length - 1) this.plantsToWaterIx = 0;else this.plantsToWaterIx++;

					if (p) {
						p.vampire = this;
						game.pathfinder.findPath(this, p, this.sprite.x, this.sprite.y, p.sprite.x, p.sprite.y);
					} else {
						console.log("COULDN'T FIND PLANT");
					}
				}
			}
		}
	}, {
		key: 'afterPath',
		value: function afterPath() {
			// END OF PATH
			//console.log("goingToFountain", this.goingToFountain);
			if (this.goingToFountain) {
				this.collideWithFountain();
			} else {
				this.water(this.curPath.destination);
			}
		}
	}]);

	return Vampire;
})(WalkingSprite);