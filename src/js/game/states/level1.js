var level1 = {};
var map, collisionLayer, player, cursors, jumpCount, jumpkey, theGame

level1.create = function () {
    
    map = this.game.add.tilemap('niveau1');


    map.addTilesetImage('tile_industriel', 'industrial');
    map.addTilesetImage('hints', 'hints');
    map.addTilesetImage('request_sheet', 'request');

   

    backgroundLayer = map.createLayer('background');
    //backgroundLayer.scale.set(1);

    collisionLayer = map.createLayer('platform');
    //collisionLayer.scale.set(1);

    collisionLayer.visible = true;

    map.setCollisionByExclusion([], true, collisionLayer);

    collisionLayer.resizeWorld();
    backgroundLayer.resizeWorld();

    
    player = this.game.add.sprite(32, this.game.world.height - 190, 'player');

    //animation du personnage cycle de marche
    player.animations.add('left', [0, 1], 10, true);
    player.animations.add('right', [0, 1], 10, true);

    player.anchor.setTo(0.5, 0.5);

    this.game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 600;
    player.scale.setTo(2, 2);

    //test pour double jump
    jumpCount = 0;
    jumpkey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    //this.game.camera.follow(player);
    this.game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);



    enemy = this.game.add.sprite(32, this.game.world.height - 190, 'enemy');

    //  Our controls.
    cursors = this.game.input.keyboard.createCursorKeys();

    // pull the exit area from the object layer
    // we will be using this one during update to check if our player has moved into the exit area
    exit = map.objects.evenement.find(o => o.name == 'exit');
    this.exitRect = new Phaser.Rectangle(exit.x, exit.y, exit.width, exit.height);
    


}

level1.update = function () {
    var hitPlatform = this.game.physics.arcade.collide(player, collisionLayer);
    player.body.velocity.x = 0;



    if (player.body.onFloor()){
        jumpkey.onDown.add(this.jumpCheck, this);
    }


    if (cursors.left.isDown) {
        
        this.flipPlayer();
        //  Move to the left
        player.body.velocity.x = -150;
        player.animations.play('right');
        if (!hitPlatform) {
            player.frame = 3;
        };

    } else if (cursors.right.isDown) {
        this.flipPlayer();
        //  Move to the right
        player.body.velocity.x = 150;
        player.animations.play('left');
        if (!hitPlatform) {
            player.frame = 3;
        };

    } else {
        //  Stand still
        player.animations.stop();
        player.frame = 2;
    }


    if (player.body.onFloor()) {
        jumpCount = 0;
    }

    if (Phaser.Rectangle.containsPoint(this.exitRect, player.position)) {
        // and we just reset it to it's starting position
        this.resetPlayer();
    }

    if(!player.inWorld){
        this.resetPlayer();
    }

}


level1.jumpCheck = function ()  { 
    if(jumpCount == 0  && !player.body.onFloor()){
        return;
    }
    else if (jumpCount < 2) {
        this.jump();       
    }
}


level1.jump = function () {
        player.body.velocity.y = -300;
        jumpCount++;
}

level1.flipPlayer = function () {
    player.scale.x *=-1;
}

level1.resetPlayer = function () {;
    this.game.state.start("preloader");
}


module.exports = level1;

