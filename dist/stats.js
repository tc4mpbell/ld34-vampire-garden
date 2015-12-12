"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Stats = (function () {
   function Stats() {
      _classCallCheck(this, Stats);
   }

   _createClass(Stats, null, [{
      key: "subtractMoney",
      value: function subtractMoney(amt) {}
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
         return this.attractiveness / this.unrest;
      }
   }]);

   return Stats;
})();