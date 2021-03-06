"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DayManager = (function () {
	function DayManager() {
		_classCallCheck(this, DayManager);
	}

	_createClass(DayManager, null, [{
		key: "init",
		value: function init() {
			this.day = 1;
			this.time = game.make.text(830, 20, '', { font: "22px Arial", fill: "#aaa" });
			game.textGroup.add(this.time);

			this.state = 'DAY';
			this.dayLength = 6;
		}
	}, {
		key: "update",
		value: function update() {
			if (this.state == "DAY") {
				// checks to see if we're at the end of the day
				if (!this.startOfDay) this.startOfDay = Date.now();

				this.time.text = this.dayLength - parseInt(game.time.elapsedSecondsSince(this.startOfDay)) + " hrs til closing";

				if (game.time.elapsedSecondsSince(this.startOfDay) >= this.dayLength - 2) {
					// 2 seconds from closing, ervybody out
					VisitorManager.escortAllOut();
				}

				if (game.time.elapsedSecondsSince(this.startOfDay) >= this.dayLength) {
					console.log("NEW NIGHT");
					this.startOfDay = Date.now();
					DayManager.endDay();
				}
			} else if (this.state == "NIGHT") {
				// checks to see if we're at the end of the day
				if (!this.startOfDay) this.startOfDay = Date.now();

				this.time.text = this.dayLength - parseInt(game.time.elapsedSecondsSince(this.startOfDay)) + " hrs til opening";

				if (game.time.elapsedSecondsSince(this.startOfDay) >= this.dayLength) {
					console.log("NEW DAY");
					this.startOfDay = Date.now();
					DayManager.endNight();
				}
			}
		}
	}, {
		key: "endDay",
		value: function endDay() {
			// var tweenDark = game.add.tween(game.world).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true,0,0,false);
			// var tweenLight = game.add.tween(game.world).to({alpha: 1}, 500, Phaser.Easing.Linear.None, false);
			// tweenDark.chain(tweenLight);

			var that = this;
			that.state = 'NIGHT';
			//VisitorManager.escortAllOut();
			VampireManager.awakenAll();

			Notify.log("End of day");

			this.fadeOut(function () {
				// DEBUG
				//VampireManager.hireVampire();
				// VisitorManager.addVisitor();

				//VampireManager.bringPendingVampiresToLife();

			});
		}
	}, {
		key: "endNight",
		value: function endNight() {
			this.state = 'DAY';
			VampireManager.allRunAway();

			this.fadeIn(function () {
				// update Plant statuses
				_.each(Garden.plants, function (p) {
					p.updateHealthStatus();
				});

				Notify.log("Paid vampires $" + VampireManager.getVampires().length * 10);
				// Pay employees
				//Stats.subtractMoney(VampireManager.vampireCount() * 10);

				// update other stats
				Stats.unrest -= 0.05 * Stats.unrest; //declines by 0.05 every day
				Stats.efficiency -= 0.1 * Stats.efficiency;
			});
		}
	}, {
		key: "fadeOut",
		value: function fadeOut(onComplete) {

			game.spr_bg = game.add.graphics(0, 0);
			game.spr_bg.beginFill("0x050530", 1);
			game.spr_bg.drawRect(0, 0, game.width, game.height);
			game.spr_bg.alpha = 0;
			game.spr_bg.endFill();

			var s = game.add.tween(game.spr_bg);
			s.to({ alpha: 0.5 }, 500, null);
			s.onComplete.add(onComplete);
			//s.yoyo(true);
			//s.onComplete.add(DayManager.fadeIn, this);
			s.start();
		}
	}, {
		key: "fadeIn",
		value: function fadeIn(onComplete) {
			console.log("fadein:");
			// game.spr_bg = game.add.graphics(0, 0);
			// game.spr_bg.beginFill("0x000", 1);
			// game.spr_bg.drawRect(0, 0, game.width, game.height);
			// game.spr_bg.alpha = 1;
			// game.spr_bg.endFill();

			var s = game.add.tween(game.spr_bg);
			s.to({ alpha: 0 }, 600, null);
			// s.onComplete.add(function() {
			// 	VisitorManager.killAll();
			// });
			s.onComplete.add(onComplete);
			s.start();
		}
	}]);

	return DayManager;
})();