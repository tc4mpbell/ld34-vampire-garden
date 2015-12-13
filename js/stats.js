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

    	return this.attractiveness - this.unrest * 10;// (this.unrest > 0 ? this.unrest : 1);
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

        this.moneyText = game.make.text(10, 20, '',  { font: "24px Arial", fill: "#ddd" });
		this.vampires = game.make.text(200, 20, '',  { font: "24px Arial", fill: "#faa" });

        game.textGroup.add(this.moneyText);
        game.textGroup.add(this.vampires);

        this.recruitBtn = game.add.button(400, 0, 'recruit-btn', function() {
        	alert("recruited");
        	VampireManager.hireVampire();
        	return false;
        });
        game.textGroup.add(this.recruitBtn);

		this.recruitCost = game.make.text(455, 38, '$20',  { font: "22px Arial", fill: "#fff" });
		game.textGroup.add(this.recruitCost);

		this.attractiveness = 80; // how attractive my park is.
		this.money = 20;
	}

	static display() {
		
		this.moneyText.text = "Money: " + this.money;
		this.vampires.text = VampireManager.getVampires().length + " vampire" + (VampireManager.getVampires().length == 1 ? "" : "s") + (_.isEmpty(VampireManager.pendingVampires) ? "" : "\nPending:" + VampireManager.pendingVampires.length);

		game.world.bringToTop(game.textGroup);

		var popColor = this.popularity == 0 ? 0xFF3300 : this.popularity == 1 ? 0xFFAAAA : 0xAAFFAA;
		var popMarker = game.add.graphics(0,0);
		popMarker.beginFill(popColor);
		popMarker.drawEllipse(600, 35, 20, 20);
		popMarker.endFill();
	}
}