class DayManager {

	static init() {
		this.day = 1;
		this.time = game.make.text(800, 30, '',  { font: "18px Arial", fill: "#ddd" });
        game.textGroup.add(this.time);
	}

	static update() {
		// checks to see if we're at the end of the day
		if(!this.startOfDay) this.startOfDay = Date.now();

		this.time.text = parseInt(game.time.elapsedSecondsSince(this.startOfDay));

		if(game.time.elapsedSecondsSince(this.startOfDay) >= 3) {
			console.log("NEW DAY");
			this.startOfDay = Date.now();
			DayManager.endDay();
		} 
	}

	static endDay() {
		// var tweenDark = game.add.tween(game.world).to({alpha: 0}, 500, Phaser.Easing.Linear.None, true,0,0,false);
		// var tweenLight = game.add.tween(game.world).to({alpha: 1}, 500, Phaser.Easing.Linear.None, false);
		// tweenDark.chain(tweenLight);
		this.fadeOut(function() {

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
			//VampireManager.hireVampire();
			// VisitorManager.addVisitor();

			VampireManager.bringPendingVampiresToLife();
			//VisitorManager.killAll();

			
		});
	}

	static fadeOut(onComplete) {

        game.spr_bg = game.add.graphics(0, 0);
        game.spr_bg.beginFill("0x000", 1);
        game.spr_bg.drawRect(0, 0, game.width, game.height);
        game.spr_bg.alpha = 0;
        game.spr_bg.endFill();


        var s = game.add.tween(game.spr_bg);
        s.to({ alpha: 1 }, 500, null);
        s.onComplete.add(onComplete);
        s.yoyo(true);
        //s.onComplete.add(DayManager.fadeIn, this);
        s.start();
	}
	// static fadeIn() {
	// 	console.log("fadein:");
	//         // game.spr_bg = game.add.graphics(0, 0);
	//         // game.spr_bg.beginFill("0x000", 1);
	//         // game.spr_bg.drawRect(0, 0, game.width, game.height);
	//         // game.spr_bg.alpha = 1;
	//         // game.spr_bg.endFill();

	//         var s = game.add.tween(game.spr_bg);
	//         s.to({ alpha: 0 }, 600, null);
	//         s.start();
	// }
}