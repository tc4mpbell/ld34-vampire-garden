"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WalkingSprite = (function () {
	function WalkingSprite() {
		_classCallCheck(this, WalkingSprite);
	}

	_createClass(WalkingSprite, [{
		key: "recalcPath",
		value: function recalcPath() {
			if (this.curPath) {
				var p = this.curPath.destination;
				if (p) {
					var sprite = p;
					if (p.sprite) {
						sprite = p.sprite;
					}
					this.curPath = null;
					game.pathfinder.findPath(this, p, this.sprite.x, this.sprite.y, sprite.x, sprite.y);
				}
			}
		}
	}, {
		key: "update",
		value: function update() {
			//game.physics.arcade.overlap(this.sprite, game.fountain, null, null, this);
			game.physics.arcade.collide(this.sprite, game.fountain, function () {
				console.log("******************** collide fountain ***");
				this.recalcPath();
			}, null, this);

			// game.physics.arcade.collide(this.sprite, game.characterGroup, function() {

			// }, null, this);	

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

						// error
						this.curPath = null;
						this.pathIx = 1;
					}

				if (dir && dir != 'STOP') {
					this.sprite.animations.play("walk");
				} else if (dir == "STOP" && this.pathIx < this.curPath.path.length - 1) {
					this.pathIx++;
				} else if (dir == "STOP") {
					if (this.afterPath) this.afterPath(); // can be overridden for fun!

					this.curPath = null;
					this.pathIx = 1;
				}
			} else if (!this.findingPath) {
				//console.log(this.id, this.plantsToWater.length, this.curPath);
				//this.findingPath = true;
				this.nextPath();
			}
		}
	}]);

	return WalkingSprite;
})();