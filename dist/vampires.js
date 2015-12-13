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
		key: 'getVampires',

		// static get vampires() { return this._vampires || []; }
		// static set vampires(v) { this._vampires = v; }

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
				}
				this.pendingVampires = 0;
				console.log("HIRED", this.vampires);
			}
		}
	}, {
		key: 'hireVampire',
		value: function hireVampire() {
			if (!this.pendingVampires) this.pendingVampires = 0;

			this.pendingVampires++;
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

var Vampire = (function (_WalkingSprite) {
	_inherits(Vampire, _WalkingSprite);

	function Vampire() {
		_classCallCheck(this, Vampire);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Vampire).call(this));

		_this.plantsToWater = [];
		_this.paths = [];
		_this.curPath = null;
		_this.plantsToWaterIx = 0;
		_this.waterLevel = 3;
		_this.goingToFountain = false;
		_this.id = _.uniqueId();

		_this.pathIx = 1;
		for (var i = 0; i < 2 * Stats.efficiency; i++) {
			// pick some unwatered plants
			var plant = Garden.findUnassignedPlant();
			if (plant) {
				_this.addPlant(plant);
			}
		}

		_this.sprite = game.add.sprite(500, 200, 'vampire', 0, game.characterGroup);
		_this.sprite.animations.add('walk', [0, 1], 8, true);

		//this.sprite.tint = 0x86bfda;
		_this.sprite.anchor.set(0.5, 1);
		game.physics.arcade.enable(_this.sprite);
		_this.sprite.body.collideWorldBounds = true;

		_this.sprite.body.bounce.setTo(1, 1);

		_this.speed = 200;
		return _this;
	}

	_createClass(Vampire, [{
		key: 'water',
		value: function water(plant) {
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
	}, {
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
			if (!this.findingPath && !this.curPath && !this.goingToFountain && this.plantsToWater.length > 0) {
				// should alternate watering with going to fountain
				// or maybe can water x plants before need refill...
				if (this.waterLevel <= 0) {
					// need to return to the fountain!
					this.waterLevel = 0;
					this.goingToFountain = true;
					game.pathfinder.findPath(this, game.fountain, this.sprite.x, this.sprite.y, game.fountain.x + game.fountain.width + 1, game.fountain.y + game.fountain.height / 2);
				} else {
					//get water plant path
					var p = this.plantsToWater[this.plantsToWaterIx];

					if (this.plantsToWaterIx && this.plantsToWaterIx >= this.plantsToWater.length - 1) this.plantsToWaterIx = 0;else this.plantsToWaterIx++;

					if (p) {
						game.pathfinder.findPath(this, p, this.sprite.x, this.sprite.y, p.sprite.x, p.sprite.y);
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
				var that = this;
				setTimeout(function () {
					// REFILL WATER
					console.log("REFILLING)");
					that.goingToFountain = false;
					that.waterLevel = 3;
				}, 1000);
			} else {
				this.water(this.curPath.destination);
			}
		}
	}]);

	return Vampire;
})(WalkingSprite);