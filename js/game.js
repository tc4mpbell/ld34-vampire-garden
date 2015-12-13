var game = new Phaser.Game("100%", "100%", Phaser.CANVAS, 'LD34');
(function() {
  //'use strict';
  function Game() {}

  var cursorPos, groundGroup, player;
  
  // variables will go here later
  Game.prototype = {
    tileSize: 64,
    plantLayer: null,
    map: null,
    preload: function() {
      // game.load.image('tile', 'assets/test/tile.png');
      // game.load.image('cube', 'assets/test/cube.png');
      game.load.spritesheet('vampire', 'assets/sprites/iso_vamp.png', 33, 56);
      game.load.spritesheet('visitor', 'assets/sprites/visitor.png', 33, 56);

      game.stage.smoothed = false;

      game.renderer.renderSession.roundPixels = false;

      game.load.tilemap('garden', 'assets/tilemaps/maps/garden.json', null, Phaser.Tilemap.TILED_JSON);
      game.load.image('garden_tiles', 'assets/tilemaps/tiles/terrain.png');

      game.load.spritesheet('plant', 'assets/tilemaps/tiles/plants.png', 16, 16);

      game.load.spritesheet('fountain', 'assets/tilemaps/tiles/fountain.png', 64, 64);
      game.load.image('water', 'assets/sprites/water.png');
      game.load.image('recruit-btn', 'assets/sprites/recruit-btn.png');
      game.load.image('gate', 'assets/sprites/gate.png');

      // spritesheets
      //game.load.spritesheet('vampire', 'assets/char/vampire.png', 16, 24);      

      game.tileSize = 96;

    },
    onTap: function(pointer, doubleTap) {
      var cursorPos = pointer.position;
          //  A single tap (tap duration was < game.input.tapRate) so change alpha
          // pic.alpha = (pic.alpha === 0.5) ? 1 : 0.5;

          console.log("mousedown", cursorPos.x, cursorPos.y);
          this.moveCharacter(null, cursorPos);

          Garden.addPlant();

          //VampireManager.hireVampire();
    },
    create: function () {
      

      game.map = game.add.tilemap('garden');

      game.input.onTap.add(this.onTap, this);

      //  The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
      //  The second parameter maps this name to the Phaser.Cache key 'tiles'
      game.map.addTilesetImage('garden_tiles');
      
      //game.map.scale.setTo(2);

      //  Creates a layer from the World1 layer in the map data.
      //  A Layer is effectively like a Phaser.Sprite, so is added to the display list.
      game.plantLayer = game.map.createLayer('Tile Layer 1');

      //game.plantLayer.scale.setTo(6);

      game.groundGroup = game.add.group();
      game.characterGroup = game.add.group();
      game.hudGroup = game.add.group();
      game.textGroup = game.add.group();
      

      console.log("game.map", game.map);

      //  This resizes the game world to match the layer dimensions
      game.plantLayer.resizeWorld();

      game.emitter = game.add.emitter(0, 0, 100);
      game.emitter.makeParticles('water');
      game.emitter.gravity = 200;

      var marker = {};
      marker.x = game.tileSize*4;//game.plantLayer.getTileX(7) * game.tileSize;
      marker.y = game.tileSize*2;//game.plantLayer.getTileY(7) * game.tileSize;

      game.fountain = game.add.sprite(marker.x, marker.y, 'fountain', groundGroup);
      game.fountain.scale.setTo(3);
      game.physics.arcade.enable(game.fountain);
      game.fountain.body.immovable = true;
      game.fountain.body.mass = 1000;

      // mark fountain tiles impassable
      // fountain is at 2,2 (see marker above)
      var tile = game.map.getTile(2, 2, game.plantLayer, true);
      var newTile = _.find(game.map.tiles, {index:2});
            console.log(game.map.tiles, newTile);

      // game.map.putTile(2, tile.x, tile.y, game.plantLayer);
      // game.map.putTile(2, tile.x+1, tile.y, game.plantLayer);
      // game.map.putTile(2, tile.x, tile.y+1, game.plantLayer);
      // game.map.putTile(2, tile.x+1, tile.y+1, game.plantLayer);

      var g = game.add.sprite(0,90, 'gate', groundGroup);
      g.scale.setTo(3);

      // Start the IsoArcade physics system.
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.pathfinder = new Pathfinder();
      Stats.init();
    },
    update: function () {
      // Update the cursor position.
        // It's important to understand that screen-to-isometric projection means you have to specify a z position manually, as this cannot be easily
        // determined from the 2D pointer position without extra trickery. By default, the z position is 0 if not set.
        //game.iso.unproject(game.input.activePointer.position, cursorPos);
        var cursorPos = game.input.activePointer.position;

        Garden.highlightTile(cursorPos.x, cursorPos.y);
        // // Loop through all tiles and test to see if the 3D position from above intersects with the automatically generated IsoSprite tile bounds.
        // _.each(game.map.layers[0].data, function (tile) {
        //   console.log(tile);
        //     var inBounds = tile.containsPoint(cursorPos.x, cursorPos.y);
        //     // If it does, do a little animation and tint change.
        //     if (!tile.selected && inBounds) {
        //         tile.selected = true;
        //         tile.tint = 0x86bfda;
        //         game.add.tween(tile).to({ y: 4 }, 200, Phaser.Easing.Quadratic.InOut, true);
        //     }
        //     // If not, revert back to how it was.
        //     else if (tile.selected && !inBounds) {
        //         tile.selected = false;
        //         tile.tint = 0xffffff;
        //         game.add.tween(tile).to({ y: 0 }, 200, Phaser.Easing.Quadratic.InOut, true);
        //     }
        // });

        // Move the player at this speed.
        var speed = 100;

        // if (this.cursors.up.isDown) {
        //     player.body.velocity.y = -speed;
        //     player.animations.play("walk");
        // }
        // else if (this.cursors.down.isDown) {
        //     player.body.velocity.y = speed;
        //     player.animations.play("walk");
        // }
        // else {
        //     player.body.velocity.y = 0;
        // }

        // if (this.cursors.left.isDown) {
        //     player.body.velocity.x = -speed;
        //     player.animations.play("walk");
        // }
        // else if (this.cursors.right.isDown) {
        //     player.body.velocity.x = speed;
        //     player.animations.play("walk");
        // }
        // else {
        //     player.body.velocity.x = 0;
        // }

        Stats.display();
        DayManager.update();
        VampireManager.update();
        VisitorManager.update();

    },
    
    render: function() {

    },
    spawnTiles: function () {
        // var tile;
        // for (var xx = 0; xx < 512; xx += 76) {
        //     for (var yy = 0; yy < 512; yy += 76) {
        //         // Create a tile using the new game.add.isoSprite factory method at the specified position.
        //         // The last parameter is the group you want to add it to (just like game.add.sprite)
        //         tile = game.add.sprite(xx, yy, 0, 'tile', 0, groundGroup);
        //         tile.anchor.set(0.5, 0);
        //     }
        // }
    },
    // Move character to a defined point 
    moveCharacter: function(sprite, pointer) {

        // if (game.characterTween && game.characterTween.isRunning) {
        //   game.characterTween.stop();
        // }

        // game.character.targetX = pointer.x; // "worldX" instead of just "x" is important so that the player can move
        // game.character.targetY = pointer.y;

        // if (game.character.x < game.character.targetX) { // Define which way the character is facing when walking  
        //   game.character.scale.x = 1; // Character faces right
        // }
        // else {
        //   game.character.scale.x = -1; // Character faces left
        // }

        // // defaultWalkingVelocity is pixels per second that the character will move.
        // // Y is 500 by default, 3d movement can be added by calculating/adding that too.
        // var duration = (this.game.physics.arcade.distanceToXY(game.character, game.character.targetX, game.character.targetY) / 200) * 1000;
        // game.character.animations.play('walk');
        // game.characterTween = this.game.add.tween(game.character.body).to({x: game.character.targetX, y: game.character.targetY}, duration, Phaser.Easing.Linear.None, true);
        // //game.characterTween.onComplete.add(function() {game.character.animations.stop()}, this);
    },
    
  };

  
  game.state.add('game', Game);
  game.state.start('game');
}());

