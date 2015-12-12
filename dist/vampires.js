"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VampireManager = (function () {
	function VampireManager() {
		_classCallCheck(this, VampireManager);
	}

	_createClass(VampireManager, null, [{
		key: "hireVampire",
		value: function hireVampire() {
			this.vampires << new Vampire();
		}
	}, {
		key: "update",
		value: function update() {
			_.each(this.vampires, function (v) {
				// update vampire
				v.update();
			});
		}
	}, {
		key: "vampires",
		get: function get() {
			return this._vampires || [];
		}
	}]);

	return VampireManager;
})();

var Vampire = (function () {
	function Vampire() {
		_classCallCheck(this, Vampire);

		this.plantsToWater = [];
		for (var i = 0; i < 2 * Stats.efficiency; i++) {
			// pick some unwatered plants
			var plant = Garden.findUnassignedPlant();
			this.plantsToWater << plant;
		}
	}

	_createClass(Vampire, [{
		key: "update",
		value: function update() {
			// cycle through paths
			_.each(this.paths, function (path) {});
		}
	}, {
		key: "water",
		value: function water(plant) {}
	}]);

	return Vampire;
})();