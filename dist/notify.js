"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Notify = (function () {
	function Notify() {
		_classCallCheck(this, Notify);
	}

	_createClass(Notify, null, [{
		key: "instruct",
		value: function instruct(message) {
			console.log(message);
			game.instruct = game.make.text(80, game.world.height - 200, message, { font: "22px Arial black", fill: "#9e5c1d" });
			game.groundGroup.add(game.instruct);

			//setTimeout(function() {
			//	game.instruct.text = "";
			//}, 2500);
		}
	}, {
		key: "log",
		value: function log(message, mArray) {
			console.log(message);
			// game.notify = game.make.text(game.world.width/2, game.world.height - 30, message,  { font: "18px Arial", fill: "#fff" });
			// game.textGroup.add(game.notify);

			// setTimeout(function() {
			// 	game.notify.text = "";
			// }, 1500);
		}
	}]);

	return Notify;
})();