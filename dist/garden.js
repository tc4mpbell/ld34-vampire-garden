"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Garden = (function () {
	function Garden() {
		_classCallCheck(this, Garden);
	}

	_createClass(Garden, null, [{
		key: "getPlants",

		// static get plants() { return this._plants || []; }
		// static set plants(p) { this._plants = p; }

		value: function getPlants() {
			return this.plants;
		}

		// TODO

	}, {
		key: "findUnassignedPlant",
		value: function findUnassignedPlant() {
			console.log("All plants", this.plants);
			return _.sample(this.plants);
		}
	}, {
		key: "addPlant",
		value: function addPlant() {
			if (!this.plants) this.plants = [];
			var marker = {};
			marker.x = game.plantLayer.getTileX(game.input.activePointer.worldX) * 128;
			marker.y = game.plantLayer.getTileY(game.input.activePointer.worldY) * 128;

			// adds at mouse position
			var p = new Plant(marker.x, marker.y);
			this.plants.push(p);
			console.log(this.plants);
		}
	}]);

	return Garden;
})();

var Plant = (function () {
	_createClass(Plant, [{
		key: "health",

		// Health: 2 (growing!), 1 (wilting), or 0 (dead)
		get: function get() {
			return this._health;
		},
		set: function set(h) {
			this._health = h;
		}

		// get sprite() { return _sprite; }
		// set sprite(s) { _sprite = s; }

	}]);

	function Plant(x, y) {
		_classCallCheck(this, Plant);

		this.health = 2;

		var tile = game.map.getTile(0, 0, game.plantLayer);

		var tileX = game.plantLayer.getTileX(x);
		var tileY = game.plantLayer.getTileY(y);

		console.log("TILE", tileX, tileY, game.plantLayer);

		game.map.putTile(tile, tileX, tileY, game.plantLayer);

		this.sprite = game.add.sprite(x, y, 'plant');
		this.sprite.scale.setTo(8, 8);

		this.planted = Date.now();

		// Update level
		game.pathfinder.updateGrid();
	}

	_createClass(Plant, [{
		key: "water",
		value: function water() {
			this.health = 3;
		}
	}, {
		key: "updateHealthStatus",
		value: function updateHealthStatus() {
			console.log("update health", this.health);
			// runs daily, see if i'm dead
			if (this.health == 0) {
				this.sprite.alive = false;
				this.sprite.frame = 5;
			} else if (this.health == 1) {
				this.sprite.frame = 4;
			} else if (this.sprite.frame < 3) {
				this.sprite.frame += 1;
			}

			this.health -= 1;
		}
	}]);

	return Plant;
})();