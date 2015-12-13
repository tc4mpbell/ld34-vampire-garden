'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VisitorManager = (function () {
	function VisitorManager() {
		_classCallCheck(this, VisitorManager);
	}

	_createClass(VisitorManager, null, [{
		key: 'addVisitor',
		value: function addVisitor() {
			if (!this.visitors) this.visitors = [];

			this.visitors.push(new Visitor());
			Stats.addMoney(10);
		}
	}, {
		key: 'update',
		value: function update() {
			if (!this.visitors) this.visitors = [];

			_.each(this.visitors, function (v) {
				v.update();
			});

			// should we get some more visitors? Let's find out!
			var numVisitors = Stats.howManyVisitors;
			for (var i = this.visitors.length; i < numVisitors; i++) {
				this.addVisitor();
			}
		}
	}, {
		key: 'killAll',
		value: function killAll() {
			if (this.visitors && this.visitors.length > 0) {
				_.each(this.visitors, function (v) {
					if (v) {
						v.sprite.kill();
					}
				});
			}
		}
	}, {
		key: 'kill',
		value: function kill(v) {
			v.sprite.kill();
			_.remove(this.visitors, { id: v.id });
		}
	}]);

	return VisitorManager;
})();

var Visitor = (function (_WalkingSprite) {
	_inherits(Visitor, _WalkingSprite);

	function Visitor() {
		_classCallCheck(this, Visitor);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Visitor).call(this));

		_this.sprite = game.add.sprite(-10, 150, 'visitor', 0, game.characterGroup);
		_this.sprite.animations.add('walk', [0, 1], 8, true);

		_this.sprite.anchor.set(0.5, 0.5);
		game.physics.arcade.enable(_this.sprite);
		_this.sprite.body.collideWorldBounds = true;
		_this.sprite.body.bounce.setTo(1, 1);
		_this.id = _.uniqueId();

		_this.speed = 100;
		return _this;
	}

	_createClass(Visitor, [{
		key: 'afterPath',
		value: function afterPath() {
			// if saw dead flower, be unhappy...
		}
	}, {
		key: 'setCurPath',
		value: function setCurPath(path) {
			this.curPath = path;
			this.findingPath = false;
		}
	}, {
		key: 'nextPath',
		value: function nextPath() {
			if (this.leaving) {
				// arrived at 1,1 -- kill this sprite

				VisitorManager.kill(this);
			} else {
				if (!this.arrivedAtSite) this.arrivedAtSite = Date.now();

				if (game.time.elapsedSecondsSince(this.arrivedAtSite) >= _.sample([1, 2])) {

					var p = _.sample(Garden.getLivePlants());
					if (p) {
						console.log("Visitor next path", this, p);
						game.pathfinder.findPath(this, p, this.sprite.x, this.sprite.y, p.sprite.x, p.sprite.y);
						this.arrivedAtSite = null;
					} else if (Garden.getLivePlants().length == 0) {
						// no live plants?
						//leave this garden!
						this.leaving = true;
						game.pathfinder.findPath(this, null, this.sprite.x, this.sprite.y, 1, 150);
					}
				} else {
					this.sprite.animations.stop();
				}
			}
		}
	}]);

	return Visitor;
})(WalkingSprite);