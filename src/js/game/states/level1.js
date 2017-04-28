var level1 = {};
var map, collisionLayer, player, cursors, jumpCount, jumpkey, theGame

level1.create = function () {
    theGame = this;
    this.world.setBounds(0, 0, 840, 3500);
    map = this.game.add.tilemap('niveau1');

    map.addTilesetImage('tile_industriel', 'industrial');
    map.addTilesetImage('hints', 'hints');
    map.addTilesetImage('request_sheet', 'request');

    backgroundLayer = map.createLayer('background');

    collisionLayer = map.createLayer('platform');

    collisionLayer.visible = true;
    //console.log(collisionLayer);

    map.setCollisionByExclusion([], true, collisionLayer);

    collisionLayer.resizeWorld();

    player = this.game.add.sprite(32, this.game.world.height - 190, 'player');

    //animation du personnage cycle de marche
    player.animations.add('left', [0, 1, 2, 1, 0], 10, true);
    player.animations.add('right', [11, 12, 13, 12, 11], 10, true);

    player.anchor.setTo(0.5, 0.5);

    this.game.physics.arcade.enable(player);
    player.body.collideWorldBounds = false;
    player.body.gravity.y = 500;
    player.scale.setTo(0.7, 0.7);

    //test pour double jump
    jumpCount = 0;
    jumpkey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
    
    



    enemy = this.game.add.sprite(32, this.game.world.height - 190, 'enemy');


    //  Our controls.
    cursors = this.game.input.keyboard.createCursorKeys();

    // pull the exit area from the object layer
    // we will be using this one during update to check if our player has moved into the exit area
    exit = map.objects.evenement.find(o => o.name == 'exit');
    this.exitRect = new Phaser.Rectangle(exit.x, exit.y, exit.width, exit.height);

    this.game.camera.follow(player);
    this.game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);

}

level1.update = function () {
    var hitPlatform = this.game.physics.arcade.collide(player, collisionLayer);
    player.body.velocity.x = 0;



    if (player.body.onFloor()){
        jumpkey.onDown.add(jumpCheck, this);
    }


    if (cursors.left.isDown) {
        //  Move to the left
        player.body.velocity.x = -350;
        player.animations.play('right');
        if (!hitPlatform) {
            player.frame = 24;
        };

    } else if (cursors.right.isDown) {
        //  Move to the right
        player.body.velocity.x = 350;
        player.animations.play('left');
        if (!hitPlatform) {
            player.frame = 23;
        };

    } else {
        //  Stand still
        player.animations.stop();
        player.frame = 22;
    }


    if (player.body.onFloor()) {
        jumpCount = 0;
    }

    if (Phaser.Rectangle.containsPoint(this.exitRect, player.position)) {
        // and we just reset it to it's starting position
        resetPlayer(theGame);
    }
    console.log(player.body.y.outOfWorldBounds);
    if(!player.inWorld){
        resetPlayer(theGame);
    }

}


jumpCheck = function () {
    if(jumpCount == 0  && !player.body.onFloor()){
        return;
    }
    else if (jumpCount < 2) {
        jump();       
    }
}


jump = function () {
        player.body.velocity.y = -300;
        jumpCount++;
}

resetPlayer = function () {;
    theGame.state.start("preloader");
}


module.exports = level1;

