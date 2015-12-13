class WalkingSprite {
	recalcPath() {
		if(this.curPath) {
			var p = this.curPath.destination;
			if(p) {
				var sprite = p;
				if(p.sprite) {
					sprite = p.sprite;
				}
				this.curPath = null;
				game.pathfinder.findPath(this, p, this.sprite.x, this.sprite.y, sprite.x, sprite.y);
			}
		}
	}

	update() {
		//game.physics.arcade.overlap(this.sprite, game.fountain, null, null, this);
		game.physics.arcade.collide(this.sprite, game.fountain, function() {
			console.log("******************** collide fountain ***");
			if(this.collidedWithFountain) { this.collidedWithFountain(); }
			this.recalcPath();
		}, null, this);	

		// game.physics.arcade.collide(this.sprite, game.characterGroup, function() {
			
		// }, null, this);	

		if(this.curPath) {
			this.findingPath = false;
			//console.log("WE HAVE A PATH");
			if(!this.pathIx) this.pathIx = 1;

			//console.log("PATH", this.curPath);

			var dir = game.pathfinder.getDirection(this.curPath.path, this.sprite, this.pathIx);
			//console.log("DIR", dir, this.sprite.body);

			if (dir == "N") {
	        	this.sprite.body.velocity.x = -this.speed;
	        	this.sprite.body.velocity.y = -this.speed;
	        }
	        else if (dir == "S")
	        {
	        	this.sprite.body.velocity.x = this.speed;
	        	this.sprite.body.velocity.y = this.speed;
	        }
	        else if (dir == "E") {
	        	this.sprite.body.velocity.x = this.speed;
	        	this.sprite.body.velocity.y = -this.speed;
	        }
	        else if (dir == "W")
	        {
	        	this.sprite.body.velocity.x = -this.speed;
	        	this.sprite.body.velocity.y = this.speed;
	        }
	        else if (dir == "SE")
	        {
	        	this.sprite.body.velocity.x = this.speed;
	        	this.sprite.body.velocity.y = 0;
	        }
	        else if (dir == "NW")
	        {
	        	this.sprite.body.velocity.x = -this.speed;
	        	this.sprite.body.velocity.y = 0;   	
	        }
	        else if (dir == "SW")
	        {
	        	this.sprite.body.velocity.x = 0;
	        	this.sprite.body.velocity.y = this.speed;    	
	        }
	       
	        else if (dir == "NE")
	        {
	        	this.sprite.body.velocity.x = 0;
	        	this.sprite.body.velocity.y = -this.speed;
	        }
	        else if (dir == "STOP")
	        {
	        	this.sprite.animations.stop();
	        	this.sprite.body.velocity.x = 0;
	        	this.sprite.body.velocity.y = 0;
	        }
	        else // JUST IN CASE IF dir wouldnt exist we stop the cowboy movement
	        {
	        	this.sprite.body.velocity.x = 0;
	        	this.sprite.body.velocity.y = 0;

	        	// error
	        	this.curPath = null;
	        	this.pathIx = 1;
	        }

	        if(dir && dir != 'STOP') {
	        	this.sprite.animations.play("walk");
	        } else if(dir == "STOP" && this.pathIx < this.curPath.path.length - 1) {
		        this.pathIx ++;
		    } else if(dir == "STOP") {
		    	if(this.afterPath) this.afterPath(); // can be overridden for fun!

		    	this.curPath = null;
				this.pathIx = 1;
		    }
		} else if(!this.findingPath) {
			//console.log(this.id, this.plantsToWater.length, this.curPath);
			//this.findingPath = true;
			this.nextPath();
		}
	}
}