class Stats {
	// def to 1
	static get efficiency() { return this._efficiency || 2; }
    static set efficiency(value) { this._efficiency = value; }

    static get unrest() { return this._unrest || 0; }
    static set unrest(value) { this._unrest = value; }

    static get howManyVisitors() {
    	// healthy plants / 2 is the potential number
    	// divide by likelihood to visit to get actual 
    	//console.log("likelihoodToVisit", this.likelihoodToVisit, (Garden.getLivePlants().length / 2) * (this.likelihoodToVisit/100));
    	return Math.floor((Garden.getLivePlants().length / 2) * (this.likelihoodToVisit/100));
    }

    // 2 is good. 0 is very bad.
    static get popularity() { 
    	if(this.likelihoodToVisit < 40) {
    		return 0;
    	} else if(this.likelihoodToVisit < 70) {
    		return 1;
    	} else {
    		return 2;
    	}
    }

    static get likelihoodToVisit() {
    	var pctLikely = this.attractiveness - this.unrest * 3;// (this.unrest > 0 ? this.unrest : 1);
    	if(Garden.getLivePlants().length <= 4) {
    		pctLikely = 0;
    	} else if(Garden.getLivePlants().length < 12) {
    		pctLikely -= 20;
    	} else if(Garden.getLivePlants().length < 20) {
    		pctLikely -= 10;
    	}
    	return pctLikely - Garden.getDeadPlants().length;
    }

    static subtractMoney(amt) {
    	this.money -= amt;
    }

    static addMoney(amt) {
    	this.money += amt;
    }

	static init() {
		game.hud_bg = game.add.graphics(0, 0);
        game.hud_bg.beginFill("#222", 1);
        game.hud_bg.drawRect(0, 0, game.width, 70);
       // game.hud_bg.alpha = 0;
        game.hud_bg.endFill();

        Notify.instruct("Click to marks spots for your vampires to plant.\n\"Recruiting\" a vampire gardener increases fear in the populace,\nwhich affects your popularity. Healthy plants help your popularity. \nVisitors give you money.");

        this.moneyText = game.make.text(10, 15, '',  { font: "32px Arial Black", fill: "#ddd" });
		this.vampires = game.make.text(175, 15, '',  { font: "32px Arial Black", fill: "#faa" });
		//this.pendingVamp = game.make.text(195, 15, '',  { font: "14px Arial Black", fill: "#aaa" });

		var s = game.add.image(150, 20, 'vampire', 0, game.textGroup);
		s.scale.setTo(0.5);

        game.textGroup.add(this.moneyText);
        game.textGroup.add(this.vampires);
        //game.textGroup.add(this.pendingVamp);

        this.recruitBtn = game.add.button(250, 0, 'recruit-btn', function() {
        	VampireManager.hireVampire();
        	Stats.display();
        	return false;
        });
        game.textGroup.add(this.recruitBtn);

		this.recruitCost = game.make.text(this.recruitBtn.x +35, 40, '$10/day',  { font: "16px Arial Black", fill: "#fff" });
		game.textGroup.add(this.recruitCost);

		var t = game.make.text(this.recruitBtn.x + 175, 15, '+1 Gardener',  { font: "16px Arial Black", fill: "#fff" });
		game.textGroup.add(t);

		var u = game.make.text(this.recruitBtn.x + 175, 40, '+1 Fear',  { font: "16px Arial Black", fill: "#ff4e4e" });
		game.textGroup.add(u);

		this.popText = game.make.text(630, 15, 'Popularity',  { font: "16px Arial Black", fill: "#fff" });
		game.textGroup.add(this.popText);

		this.plantCount = game.make.text(this.popText.x, 40, '',  { font: "14px Arial", fill: "#fff" });
		game.textGroup.add(this.plantCount);

		this.unrestCount = game.make.text(this.popText.x +120, 40, 'Low Fear',  { font: "14px Arial", fill: "#f66" });
		game.textGroup.add(this.unrestCount);

		this.attractiveness = 80; // how attractive my park is.
		this.money = 20;
	}

	static display() {
		
		this.moneyText.text = "$" + this.money;
		
		this.vampires.text = VampireManager.vampireCount();// + VampireManager.pendingVampires;
		//this.pendingVamp.text = "/" + VampireManager.pendingVampires;//(pending ? "Pending:" + pending : "");
		this.plantCount.text = "Healthy Plants: " + Garden.getLivePlants().length;
		this.unrestCount.text = "Fear: " + Math.round(this.unrest*100)/100;

		game.world.bringToTop(game.textGroup);

		var popColor = this.popularity == 0 ? 0xff0a0a : this.popularity == 1 ? 0xfcff0a : 0x0ab01e;
		var popMarker = game.add.graphics(0,0);
		popMarker.beginFill(popColor);
		popMarker.drawEllipse(600, 35, 20, 20);
		popMarker.endFill();
	}
}