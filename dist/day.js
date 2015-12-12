"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DayManager = (function () {
	function DayManager() {
		_classCallCheck(this, DayManager);
	}

	_createClass(DayManager, null, [{
		key: "update",
		value: function update() {
			// checks to see if we're at the end of the day
			if (!this.startOfDay) this.startOfDay = Date.now();

			if (game.time.elapsedSecondsSince(this.startOfDay) >= 3) {
				console.log("NEW DAY");
				this.startOfDay = Date.now();
				DayManager.endDay();
			}
		}
	}, {
		key: "endDay",
		value: function endDay() {
			// Pay employees
			Stats.subtractMoney(VampireManager.vampires.length * 20);
			Notify.log("Paid vampires $" + VampireManager.vampires.length * 20);

			// update other stats
			Stats.unrest -= 0.05 * Stats.unrest; //declines by 0.05 every day
			Stats.efficiency -= 0.1 * Stats.efficiency;

			// update Plant statuses
			_.each(Garden.plants, function (p) {
				p.updateHealthStatus();
			});
		}
	}]);

	return DayManager;
})();