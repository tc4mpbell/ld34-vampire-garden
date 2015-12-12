class DayManager {

	static update() {
		// checks to see if we're at the end of the day
		if(!this.startOfDay) this.startOfDay = Date.now();

		if(game.time.elapsedSecondsSince(this.startOfDay) >= 4) {
			console.log("NEW DAY");
			this.startOfDay = Date.now();
			DayManager.endDay();
		} 
	}

	static endDay() {
		var tweenDark = game.add.tween(game.world).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true,0,0,false);
		var tweenLight = game.add.tween(game.world).to({alpha: 1}, 500, Phaser.Easing.Linear.None, false);
		tweenDark.chain(tweenLight);

		// Pay employees
		Stats.subtractMoney(VampireManager.getVampires().length * 20);
		Notify.log("Paid vampires $" + VampireManager.getVampires().length * 20);

		// update other stats
		Stats.unrest -= 0.05 * Stats.unrest; //declines by 0.05 every day
		Stats.efficiency -= 0.1 * Stats.efficiency;

		// update Plant statuses
		_.each(Garden.plants, function(p) {
			p.updateHealthStatus();
		});

		// DEBUG
		VampireManager.hireVampire();
	}
}