var game = {};
var logo;


game.create = function () {

  logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
  logo.anchor.setTo(0.5, 0.5);

  game.stage.backgroundColor = '#0072bc';

  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.enableBody(logo);


  logo.body.collideWorldBounds = true;

  logo.scale.setTo(0.5);
  logo.body.allowRotation = false;
};

game.update = function () {
  logo.rotation = game.physics.arcade.moveToPointer(logo, 60, game.input.activePointer, 500);
};


module.exports = game;
