'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WalkingSprite = (function () {
	function WalkingSprite() {
		_classCallCheck(this, WalkingSprite);
	}

	_createClass(WalkingSprite, [{
		key: 'recalcPath',
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
		key: 'update',
		value: function update() {

			//game.physics.arcade.overlap(this.sprite, game.fountain, null, null, this);
			game.physics.arcade.collide(this.sprite, game.fountain, function () {
				console.log("******************** collide fountain ***");
				if (this.collidedWithFountain) {
					this.collidedWithFountain();
				} else {
					this.sprite.x += 10;
					this.sprite.y -= 10;
					this.recalcPath();
				}
			}, null, this);

			// game.physics.arcade.collide(this.sprite, game.characterGroup, function() {

			// }, null, this);	

			if (this.curPath) {
				//console.log("curPath", this);

				this.findingPath = false;
				//console.log("WE HAVE A PATH");
				if (!this.pathIx) this.pathIx = 1;

				//console.log("PATH", this.curPath);
				var oldDir = this.curDir;
				this.curDir = game.pathfinder.getDirection(this.curPath.path, this.sprite, this.pathIx);

				if (oldDir) {
					if (_.contains(oldDir, 'W') && _.contains(this.curDir, 'E') || _.contains(oldDir, 'E') && _.contains(this.curDir, 'W')) {
						console.log("SWAP DIR");
						this.sprite.scale.x *= -1; //flip
					}
				}

				if (this.curDir == "N") {
					this.sprite.body.velocity.x = -this.speed;
					this.sprite.body.velocity.y = -this.speed;
				} else if (this.curDir == "S") {
					this.sprite.body.velocity.x = this.speed;
					this.sprite.body.velocity.y = this.speed;
				} else if (this.curDir == "E") {
					this.sprite.body.velocity.x = this.speed;
					this.sprite.body.velocity.y = -this.speed;
				} else if (this.curDir == "W") {
					this.sprite.body.velocity.x = -this.speed;
					this.sprite.body.velocity.y = this.speed;
				} else if (this.curDir == "SE") {
					this.sprite.body.velocity.x = this.speed;
					this.sprite.body.velocity.y = 0;
				} else if (this.curDir == "NW") {
					this.sprite.body.velocity.x = -this.speed;
					this.sprite.body.velocity.y = 0;
				} else if (this.curDir == "SW") {
					this.sprite.body.velocity.x = 0;
					this.sprite.body.velocity.y = this.speed;
				} else if (this.curDir == "NE") {
					this.sprite.body.velocity.x = 0;
					this.sprite.body.velocity.y = -this.speed;
				} else if (this.curDir == "STOP") {
					this.sprite.animations.stop();
					this.sprite.body.velocity.x = 0;
					this.sprite.body.velocity.y = 0;
				} else // JUST IN CASE IF this.curDir wouldnt exist we stop the cowboy movement
					{
						this.sprite.body.velocity.x = 0;
						this.sprite.body.velocity.y = 0;

						// error
						this.curPath = null;
						this.pathIx = 1;
					}

				if (this.curDir && this.curDir != 'STOP') {
					this.sprite.animations.play("walk");
				} else if (this.curDir == "STOP" && this.pathIx < this.curPath.path.length - 1) {
					this.pathIx++;
				} else if (this.curDir == "STOP") {
					if (this.afterPath) this.afterPath(); // can be overridden for fun!

					this.curPath = null;
					this.pathIx = 1;

					this.curDir = null;
				}

				//this.recalcPath();
			} else if (!this.findingPath) {
					console.log("no path", this);
					//console.log(this.id, this.plantsToWater.length, this.curPath);
					//this.findingPath = true;
					this.nextPath();
				}
			// else {
			// 	//debug
			// 	game.pathfinder.updateGrid();
			// }
		}
	}]);

	return WalkingSprite;
})();