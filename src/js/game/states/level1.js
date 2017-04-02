var level1 = {};
var map;
var collisionLayer;
var player;
var cursors;

level1.create = function () {
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

    //map.setCollision(1)

    player = this.game.add.sprite(32, this.game.world.height - 190, 'player');
    player.anchor.setTo(0.5, 0.5);

    this.game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 500;


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
    this.game.physics.arcade.collide(player, collisionLayer);
    player.body.velocity.x = 0;


    if (cursors.left.isDown) {
        //  Move to the left
        player.body.velocity.x = -150;

    }

    if (cursors.right.isDown) {
        //  Move to the right
        player.body.velocity.x = 150;

    }
    if (cursors.up.isDown) {
        //  Move to the right
        player.body.velocity.y = -350;

    }
    if (cursors.down.isDown) {
        //  Move to the right
        player.body.velocity.y = 150;

    }
    if (Phaser.Rectangle.containsPoint(this.exitRect, player.position)) {
        // and we just reset it to it's starting position
        resetPlayer();
    }
}

resetPlayer = function(){
    console.log("sreset");
}

module.exports = level1;