"use strict";

var game = new Phaser.Game("100%", "100%", Phaser.CANVAS, 'LD34');
(function () {
  //'use strict';
  function Game() {}

  var cursorPos, groundGroup, player;

  // variables will go here later
  Game.prototype = {
    plantLayer: null,
    map: null,
    preload: function preload() {
      // game.load.image('tile', 'assets/test/tile.png');
      // game.load.image('cube', 'assets/test/cube.png');
      game.load.spritesheet('vampire', 'assets/char/iso_vamp.png', 33, 56);

      game.stage.smoothed = false;

      game.renderer.renderSession.roundPixels = false;

      game.load.tilemap('garden', 'assets/tilemaps/maps/garden.json', null, Phaser.Tilemap.TILED_JSON);
      game.load.image('garden_tiles', 'assets/tilemaps/tiles/dirt.png');

      game.load.spritesheet('plant', 'assets/tilemaps/tiles/plants.png', 16, 16);

      game.load.spritesheet('fountain', 'assets/tilemaps/tiles/fountain.png', 64, 64);

      // spritesheets
      //game.load.spritesheet('vampire', 'assets/char/vampire.png', 16, 24);

      game.pathfinder = new Pathfinder();
    },
    onTap: function onTap(pointer, doubleTap) {
      var cursorPos = pointer.position;
      //  A single tap (tap duration was < game.input.tapRate) so change alpha
      // pic.alpha = (pic.alpha === 0.5) ? 1 : 0.5;

      console.log("mousedown", cursorPos.x, cursorPos.y);
      this.moveCharacter(null, cursorPos);

      Garden.addPlant();

      //VampireManager.hireVampire();
    },
    create: function create() {
      game.map = game.add.tilemap('garden');

      game.input.onTap.add(this.onTap, this);

      //  The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
      //  The second parameter maps this name to the Phaser.Cache key 'tiles'
      game.map.addTilesetImage('garden_tiles');

      //  Creates a layer from the World1 layer in the map data.
      //  A Layer is effectively like a Phaser.Sprite, so is added to the display list.
      game.plantLayer = game.map.createLayer('Tile Layer 1');

      game.groundGroup = game.add.group();
      game.characterGroup = game.add.group();

      console.log("game.map", game.map);

      //  This resizes the game world to match the layer dimensions
      game.plantLayer.resizeWorld();

      game.fountain = game.add.sprite(300, 300, 'fountain', groundGroup);
      game.fountain.scale.setTo(6);
      game.physics.arcade.enable(game.fountain);

      //game.character = player =

      //////////

      // var vamp = game.add.sprite(40, 100, 'vampire');
      // vamp.animations.add('walk', [0, 1], 8, true);

      // Start the IsoArcade physics system.
      game.physics.startSystem(Phaser.Physics.ARCADE);

      // Let's make a load of tiles on a grid.
      // this.spawnTiles();

      // Create another cube as our 'player', and set it up just like the cubes above.
      //player = game.add.isoSprite(128, 128, 0, 'cube', 0, groundGroup);
    },
    update: function update() {
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

      DayManager.update();
      VampireManager.update();
    },

    render: function render() {},
    spawnTiles: function spawnTiles() {
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
    moveCharacter: function moveCharacter(sprite, pointer) {

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
    }

  };

  game.state.add('game', Game);
  game.state.start('game');
})();