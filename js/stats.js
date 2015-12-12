class Stats {
	// def to 1
	static get efficiency() { return this._efficiency || 1; }
    static set efficiency(value) { this._efficiency = value; }

    static get unrest() { return this._unrest || 0; }
    static set unrest(value) { this._unrest = value; }

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
    	return this.attractiveness / this.unrest;
    }

    static subtractMoney(amt) {}
}