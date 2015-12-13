class VisitorManager {

	static addVisitor() {
		if(!this.visitors) this.visitors = [];

		this.visitors.push(new Visitor());
		Stats.addMoney(10);
	}

	static update() {
		if(!this.visitors) this.visitors = [];

		_.each(this.visitors, function(v) {
			if(v && v.update) {
				v.update();
			}
		});

		// should we get some more visitors? Let's find out!
		var numVisitors = Stats.howManyVisitors;
		for(var i = this.visitors.length; i < numVisitors; i++) {
			this.addVisitor();
		}
	}

	static escortAllOut() {
		if(this.visitors && this.visitors.length > 0) {
			_.each(this.visitors, function(v) {
				if(v) {
					v.sprite.speed = 430;
					v.leave();
				}
			});
		}
	}

	static kill(v) {
		v.sprite.kill();
		_.remove(this.visitors, {id: v.id});
	}
}


class Visitor extends WalkingSprite {
	constructor() {
		super();
		this.sprite = game.add.sprite(game.gate.x+20, game.gate.y+50, 'visitor', 0, game.characterGroup);
		this.sprite.animations.add('walk', [0, 1], 8, true);

		//this.sprite.scale.setTo();//(1/(96/game.tileSize), 1/(96/game.tileSize));

		this.sprite.anchor.set(0.5, 0.5);
		game.physics.arcade.enable(this.sprite);
		this.sprite.body.collideWorldBounds = true;
		this.sprite.body.bounce.setTo(1, 1);
		this.id = _.uniqueId();

		this.speed = 170;
	}

	afterPath() {
		// if saw dead flower, be unhappy...
	}

	setCurPath(path) {
		this.curPath = path;
		this.findingPath = false;
	}

	leave() {
		this.curPath = null;
		//leave this garden!
		this.leaving = true;
		this.findingPath = true;
		game.pathfinder.findPath(this, null, this.sprite.x, this.sprite.y, game.gate.x, game.gate.y);
	}

	nextPath() {
		if(this.leaving && !this.findingPath) {
			// arrived at 1,1 -- kill this sprite
			
			VisitorManager.kill(this);
		} else {
			if(!this.arrivedAtSite) this.arrivedAtSite = Date.now();
			if(!this.plantsSeen) this.plantsSeen = 0;
			

			if(game.time.elapsedSecondsSince(this.arrivedAtSite) >= _.sample([1,2])) {
				
				if(this.plantsSeen == _.sample([1,2])) {
					this.leave();
				} else {
					var p = _.sample(Garden.getLivePlants());
					if(p) {
						console.log("Visitor next path", this, p);
						game.pathfinder.findPath(this, p, this.sprite.x, this.sprite.y, p.sprite.x, p.sprite.y);
						this.arrivedAtSite = null;
					} else if(Garden.getLivePlants().length == 0) {
						// no live plants?
						this.leave()
					}
					this.plantsSeen++;
				}
			} else {
				this.sprite.animations.stop();
			}
		}
	}

}