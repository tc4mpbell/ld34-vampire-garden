class VisitorManager {

	static addVisitor() {
		if(!this.visitors) this.visitors = [];

		this.visitors.push(new Visitor());
		//Stats.addMoney(10);
	}

	static update() {
		if(!this.visitors) this.visitors = [];

		_.each(this.visitors, function(v) {
			if(v) {
				v.update();
			}
		});

		if(DayManager.state == 'DAY') {
			//console.log("DAY FOR VISITORS", this.visitors.length);
			// should we get some more visitors? Let's find out!
			var numVisitors = Stats.howManyVisitors;
			for(var i = this.visitors.length; i < numVisitors; i++) {
				this.addVisitor();
			}
		} else {
			//this.killAll();
		}
	}

	static escortAllOut() {
		if(this.visitors && this.visitors.length > 0) {
			_.each(_.clone(this.visitors), function(v) {
				if(v && v.leave) {
					//v.sprite.alive = false;
					v.leave();
				}
			});
		}
	}

	static killAll() {
		if(this.visitors && this.visitors.length > 0) {
			_.each(_.clone(this.visitors), function(v) {
				if(v) {
					VisitorManager.kill(v);
				}
			}, this);
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
		this.sprite = game.add.sprite(game.gate.x+100, game.gate.y+50, 'visitor', 0, game.characterGroup);
		this.sprite.animations.add('walk', [0, 1], 8, true);

		this.sprite.scale.setTo(1);//(1/(96/game.tileSize), 1/(96/game.tileSize));

		this.sprite.anchor.set(0.5, 0.5);
		game.physics.arcade.enable(this.sprite);
		this.sprite.body.collideWorldBounds = true;
		//this.sprite.body.bounce.setTo(1, 1);
		this.id = _.uniqueId();

		this.speed = 270;

		this.leaving = false;
		this.findingPath = false;
		this.plantsSeen = 0;
	}

	afterPath() {
		// if saw dead flower, be unhappy...
	}

	setCurPath(path) {
		this.curPath = path;
		this.findingPath = false;
	}

	leave() {
		VisitorManager.kill(this);
		return;

		this.curPath = null;
		//leave this garden!
		this.leaving = true;
		this.findingPath = true;
		this.speed = 530;
		try {
			game.pathfinder.findPath(this, null, this.sprite.x, this.sprite.y, game.gate.x+30, game.gate.y+50);
		} catch(ex) {
			// alert(this.sprite.x);
			// alert("couldn't find path: " + this.sprite.x.toString() + "-" + this.sprite.y.toString() + "-" + (game.gate.x-20) + "-" +(game.gate.y+50))
			VisitorManager.kill(this);
		}
	}


	pathFailed() {
		console.log("VIS ATH FAILED");
		this.findingPath = false;
		this.curPath = false; 
		
		this.sprite.body.velocity.x = 0;
		this.sprite.body.velocity.y = 0;
		this.sprite.x += 10;
		this.nextPath();
	}

	nextPath() {
		console.log("NEXT PATH", this);

		if(this.leaving) {
			// arrived at 1,1 -- kill this sprite
			VisitorManager.kill(this);
		} else if(!this.leaving && !this.findingPath && !this.curPath) {
			if(!this.arrivedAtSite) this.arrivedAtSite = Date.now();
			if(!this.plantsSeen) this.plantsSeen = 0;
			
			console.log("VIS MANAGER", this.leaving, this.findingPath, this.curPath, this.plantsSeen);

			if(game.time.elapsedSecondsSince(this.arrivedAtSite) >= _.sample([1,2]) || this.plantsSeen <= 0) {
				
				if(this.plantsSeen >= 2) {
					this.leave();
				} else {
					var p = _.sample(Garden.getLivePlants());
					if(p) {
						console.log("Visitor next path", this, p);
						game.pathfinder.findPath(this, p, this.sprite.x, this.sprite.y, p.sprite.x, p.sprite.y);
						this.arrivedAtSite = null;
					} else if(Garden.getLivePlants().length == 0) {
						// no live plants?
						this.leave();
					}
					this.plantsSeen++;
					Stats.addMoney(5);
				
				}
			} else {
				this.sprite.animations.stop();
			}
		} else {
			console.log("THIS", this);
			//this.leave();
		}
	}

}