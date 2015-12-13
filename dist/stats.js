"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Stats = (function () {
  function Stats() {
    _classCallCheck(this, Stats);
  }

  _createClass(Stats, null, [{
    key: "subtractMoney",
    // (this.unrest > 0 ? this.unrest : 1);
    value: function subtractMoney(amt) {
      console.log("MONEYs", amt);
      this.money -= amt;
    }
  }, {
    key: "addMoney",
    value: function addMoney(amt) {
      console.log("MONEYs", amt);
      this.money += amt;
    }
  }, {
    key: "init",
    value: function init() {
      game.hud_bg = game.add.graphics(0, 0);
      game.hud_bg.beginFill("#222", 1);
      game.hud_bg.drawRect(0, 0, game.width, 70);
      // game.hud_bg.alpha = 0;
      game.hud_bg.endFill();

      this.moneyText = game.make.text(10, 20, '', { font: "24px Arial", fill: "#ddd" });
      this.vampires = game.make.text(200, 20, '', { font: "24px Arial", fill: "#faa" });

      game.textGroup.add(this.moneyText);
      game.textGroup.add(this.vampires);

      this.recruitBtn = game.add.button(400, 0, 'recruit-btn', function () {
        alert("recruited");
        VampireManager.hireVampire();
        return false;
      });
      game.textGroup.add(this.recruitBtn);

      this.recruitCost = game.make.text(455, 38, '$20', { font: "22px Arial", fill: "#fff" });
      game.textGroup.add(this.recruitCost);

      this.attractiveness = 80; // how attractive my park is.
      this.money = 20;
    }
  }, {
    key: "display",
    value: function display() {

      this.moneyText.text = "Money: " + this.money;
      this.vampires.text = VampireManager.getVampires().length + " vampire" + (VampireManager.getVampires().length == 1 ? "" : "s");

      game.world.bringToTop(game.textGroup);

      var popColor = this.popularity == 0 ? 0xFF3300 : this.popularity == 1 ? 0xFFAAAA : 0xAAFFAA;
      var popMarker = game.add.graphics(0, 0);
      popMarker.beginFill(popColor);
      popMarker.drawEllipse(600, 35, 20, 20);
      popMarker.endFill();
    }
  }, {
    key: "efficiency",

    // def to 1
    get: function get() {
      return this._efficiency || 1;
    },
    set: function set(value) {
      this._efficiency = value;
    }
  }, {
    key: "unrest",
    get: function get() {
      return this._unrest || 0;
    },
    set: function set(value) {
      this._unrest = value;
    }
  }, {
    key: "howManyVisitors",
    get: function get() {
      // healthy plants / 2 is the potential number
      // divide by likelihood to visit to get actual
      console.log("likelihoodToVisit", this.likelihoodToVisit, Garden.getLivePlants().length / 2 * (this.likelihoodToVisit / 100));
      return Math.floor(Garden.getLivePlants().length / 2 * (this.likelihoodToVisit / 100));
    }

    // 2 is good. 0 is very bad.

  }, {
    key: "popularity",
    get: function get() {
      if (this.likelihoodToVisit < 40) {
        return 0;
      } else if (this.likelihoodToVisit < 70) {
        return 1;
      } else {
        return 2;
      }
    }
  }, {
    key: "likelihoodToVisit",
    get: function get() {

      return this.attractiveness - this.unrest * 10;
    }
  }]);

  return Stats;
})();