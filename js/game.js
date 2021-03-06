var game = new Phaser.Game(1060, 800, Phaser.CANVAS, 'LD34');
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
      game.tileSize = 32; //96
      game.scaleFactor = 3;//game.tileSize/16; //6

      // game.load.image('tile', 'assets/test/tile.png');
      // game.load.image('cube', 'assets/test/cube.png');
      game.load.spritesheet('vampire', 'assets/sprites/iso_vamp.png', 33, 56);
      game.load.spritesheet('visitor', 'assets/sprites/visitor.png', 33, 56);

      game.stage.smoothed = false;

      game.renderer.renderSession.roundPixels = false;

      game.load.tilemap('garden', 'assets/tilemaps/maps/garden.json', null, Phaser.Tilemap.TILED_JSON);
      game.load.image('garden_tiles_32', 'assets/tilemaps/tiles/terrain32x32.png');
      game.load.image('garden_tiles_64', 'assets/tilemaps/tiles/terrain64x64.png');

      game.load.spritesheet('plant', 'assets/tilemaps/tiles/plants.png', 16, 16);

      game.load.spritesheet('fountain', 'assets/tilemaps/tiles/fountain.png', 64, 64);
      game.load.image('water', 'assets/sprites/water.png');
      game.load.image('recruit-btn', 'assets/sprites/recruit-btn.png');
      game.load.image('gate', 'assets/sprites/gate.png');
    },
    onTap: function(pointer, doubleTap) {
      var cursorPos = pointer.position;
          //  A single tap (tap duration was < game.input.tapRate) so change alpha
          // pic.alpha = (pic.alpha === 0.5) ? 1 : 0.5;
          Garden.addPlant();

          //VampireManager.hireVampire();
    },
    create: function () {
      //scaling options
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      
      //have the game centered horizontally
      game.scale.pageAlignHorizontally = true;
      game.scale.pageAlignVertically = true;

      game.map = game.add.tilemap('garden');

      // game.map.scale = {x:2};

      // game.map.width = game.width / game.tileSize;
      // game.map.height = game.height / game.tileSize;

      //game.input.onTap.add(this.onTap, this);

      //  The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
      //  The second parameter maps this name to the Phaser.Cache key 'tiles'
      game.map.addTilesetImage('garden_tiles_' + game.tileSize, 'garden_tiles_32');//, 'gt', game.tileSize, game.tileSize);
      
      //game.map.scale.setTo(2);

      //  Creates a layer from the World1 layer in the map data.
      //  A Layer is effectively like a Phaser.Sprite, so is added to the display list.
      game.plantLayer = game.map.createLayer('Tile Layer 1');
      // game.map.height = Math.floor(game.height/game.tileSize);
      // game.map.width = Math.floor(game.width/game.tileSize);
      //game.plantLayer = game.map.createBlankLayer("Ground", game.map.width, game.map.height, game.tileSize, game.tileSize);

      //var tileset = game.map.tilesets[0];
      game.map.setTileSize(game.tileSize, game.tileSize);

      game.map.tileWidth = game.plantLayer.tileWidth = game.tileSize;
      game.map.tileHeight = game.plantLayer.tileHeight = game.tileSize;

      game.world.sendToBack(game.plantLayer);

      // game.plantLayer.scale.x = game.scaleFactor;
      // game.plantLayer.scale.y = game.scaleFactor;
      
      //game.map.fill(1, 0, 0, game.map.width, game.map.height, game.plantLayer);

      //var level = [];
      // for(var i = 1; i<=game.map.width; i++) {
      //   //level.push(1);
      //   for(var a = 1; a<=game.map.height; a++) {
      //     //game.map.putTile(1, i, a, game.plantLayer);
      //   }
      // }
      // game.map.layers[0].data = level;
      // game.plantLayer.data = level;
      
      for(var i = 0; i<game.map.width; i++) {
        for(var a = 0; a<game.map.height; a++) {
          if(i == 0 || a == 0 || ((a==2 || a==1) && (i<20||i>25)) || i >= Math.floor(game.map.width - 1) || a == Math.floor(game.map.height - 1)) {
            // avoid tiles under the door
            
            game.map.putTile(8, i, a, game.plantLayer);
            
            console.log("BRICK")
          }
        }
      }

      console.log(game.map.layers[0].height, game.map.layers[0].width);

      //game.plantLayer.scale.setTo(6);

      game.groundGroup = game.add.group();
      game.characterGroup = game.add.group();
      game.hudGroup = game.add.group();
      game.textGroup = game.add.group();


// game.hudGroup.visible = false;
// game.textGroup.visible = false;
      //game.plantLayer.scale.setTo(0.5, 0.5);
      //game.groundGroup.scale.setTo(0.5, 0.5);


      console.log("game.map", game.map);

      //  This resizes the game world to match the layer dimensions
      game.plantLayer.resizeWorld();

      game.emitter = game.add.emitter(0, 0, 100);
      game.emitter.makeParticles('water');
      game.emitter.gravity = 200;

      var marker = {};
      marker.x = 0;//game.plantLayer.getTileX(7) * game.tileSize;
      marker.y = game.tileSize*4;//game.plantLayer.getTileY(7) * game.tileSize;

      // fountain is two tiles high. Position at 0,3
      game.fountain = game.add.sprite(marker.x + game.tileSize, marker.y +8, 'fountain', groundGroup);
      game.fountain.scale.setTo(game.scaleFactor/1.7);//3.5);
      game.physics.arcade.enable(game.fountain);
      game.fountain.body.immovable = true;
      game.fountain.body.mass = 1000;

      // mark fountain tiles impassable
      // fountain is at 2,2 (see marker above)
      // var tile = game.map.getTile(marker.x/game.tileSize, marker.y/game.tileSize, game.plantLayer, true);
      // var newTile = _.find(game.map.tiles, {index:2});
      //       console.log(game.map.tiles, newTile);

      // game.map.putTile(2, tile.x, tile.y, game.plantLayer);
      // game.map.putTile(2, tile.x+1, tile.y, game.plantLayer);
      // game.map.putTile(2, tile.x, tile.y+1, game.plantLayer);
      // game.map.putTile(2, tile.x+1, tile.y+1, game.plantLayer);

      // game.map.resetTilesetCache()

      game.gate = game.add.sprite(-10, 420, 'gate', game.textGroup);
      game.gate.scale.setTo(game.scaleFactor/2);


      // var fence = game.add.graphics(0,0);
      // fence.beginFill(0x222222);
      // fence.drawRect(0, game.gate.y+8, game.gate.x, game.gate.height-16);
      // fence.endFill();
      // game.textGroup.add(fence); //show above dudes

      // Start the IsoArcade physics system.
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.pathfinder = new Pathfinder();

      Stats.init();
      DayManager.init();


      // //  Our tile selection window
      // var tileSelector = game.add.group();

      // var tileSelectorBackground = game.make.graphics();
      // tileSelectorBackground.beginFill(0x000000, 0.5);
      // tileSelectorBackground.drawRect(0, game.height-75, game.width, 66);
      // tileSelectorBackground.endFill();

      // tileSelector.add(tileSelectorBackground);

      // var tileStrip = tileSelector.create(1, game.height-64, 'garden_tiles_' + game.tileSize);
      // tileStrip.inputEnabled = true;
      // //tileStrip.events.onInputDown.add(pickTile, this);

      // tileSelector.fixedToCamera = true;
    },
    update: function () {
      // Update the cursor position.
      // It's important to understand that screen-to-isometric projection means you have to specify a z position manually, as this cannot be easily
      // determined from the 2D pointer position without extra trickery. By default, the z position is 0 if not set.
      //game.iso.unproject(game.input.activePointer.position, cursorPos);
      var cursorPos = game.input.activePointer.position;

      Garden.highlightTile(cursorPos.x, cursorPos.y);

      if(game.input.activePointer.isDown) {
        this.onTap(game.input.activePointer);
      }      
      // Move the player at this speed.
      var speed = 100;


      // start with one
      if(VampireManager.vampireCount() <= 0) {
        VampireManager.hireVampire();
      }

      Stats.display();
      DayManager.update();
      VampireManager.update();
      VisitorManager.update();
    }
  };

  
  game.state.add('game', Game);
  game.state.start('game');
}());

