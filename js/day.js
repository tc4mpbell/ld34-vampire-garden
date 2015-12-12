class DayManager {

	static update() {
		// checks to see if we're at the end of the day
		if(!this.startOfDay) this.startOfDay = Date.now();

		if(game.time.elapsedSecondsSince(this.startOfDay) >= 3) {
			console.log("NEW DAY");
			this.startOfDay = Date.now();
			DayManager.endDay();
		} 
	}

	static endDay() {
		// Pay employees
		Stats.subtractMoney(VampireManager.vampires.length * 20);
		Notify.log("Paid vampires $" + VampireManager.vampires.length * 20);

		// update other stats
		Stats.unrest -= 0.05 * Stats.unrest; //declines by 0.05 every day
		Stats.efficiency -= 0.1 * Stats.efficiency;

		// update Plant statuses
		_.each(Garden.plants, function(p) {
			p.updateHealthStatus();
		});
	}
}