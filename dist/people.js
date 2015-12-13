'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Person = (function () {
	function Person() {
		_classCallCheck(this, Person);

		this.sprite = game.add.sprite(500, 200, 'visitor', 0, game.characterGroup);
		this.sprite.animations.add('walk', [0, 1], 8, true);

		this.sprite.anchor.set(0.5, 0.5);
		game.physics.arcade.enable(this.sprite);
		this.sprite.body.collideWorldBounds = true;

		this.speed = 100;
	}

	_createClass(Person, [{
		key: 'setCurPath',
		value: function setCurPath(path) {
			this.curPath = path;
			this.findingPath = false;
		}
	}, {
		key: 'nextPath',
		value: function nextPath() {
			var p = _.sample(Garden.getPlants());
			game.pathfinder.findPath(this, p, this.sprite.x, this.sprite.y, p.sprite.x, p.sprite.y);
		}
	}, {
		key: 'update',
		value: function update() {
			// wander wander wander

		}
	}]);

	return Person;
})();