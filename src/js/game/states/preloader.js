var preloader = {};

preloader.preload = function () {
  //this.game.load.image('logo', 'images/phaser.png');

  //ajoute un libelle qui indique le chargement dans le canvas
  var loadingLabel = this.game.add.text(this.game.width / 2, 100, 'chargement...', {
    font: '25px pixelSmall',
    fill: '#ffffff'
  });
  loadingLabel.anchor.setTo(0.5, 0.5);

  //affiche la berre de progres en utilisant la progression de boot.js
  var progressBar = this.game.add.sprite(this.game.width / 2, 150, 'progressBar');
  progressBar.scale.setTo(0.8,0.8);
  progressBar.anchor.setTo(0.5, 0.5);
  this.game.load.setPreloadSprite(progressBar);

  //charge le joueur
  this.game.load.spritesheet('player','images/pixel_perso.png',21,21);

  //et le reste des images : enemy
  this.game.load.image('enemy','images/enemy.png');
  this.game.load.image('enemy_death','images/enemy_dead.png');

  this.game.load.image('laser', 'images/laser.png');

  //bouton mute sur le menu principale
  this.game.load.spritesheet('mute','images/muteButton.png',28,22);

  //preload all tilemap
  this.game.load.tilemap('tutorial', 'images/tutorial.json', null, Phaser.Tilemap.TILED_JSON);
  this.game.load.tilemap('niveau1', 'images/niveau1.json', null, Phaser.Tilemap.TILED_JSON);
  this.game.load.tilemap('niveau2', 'images/niveau2.json', null, Phaser.Tilemap.TILED_JSON);
  this.game.load.tilemap('levelSelect', 'images/levelSelect.json', null, Phaser.Tilemap.TILED_JSON);

  //preload particle
  this.game.load.image('splat','images/redParticle.jpeg');

  //  Next we load the tileset. This is just an image, loaded in via the normal way we load images:
  this.game.load.image('pixel','images/pixel.png');
  this.game.load.image('pixelui','images/pixelui.png');

  //charge le background pour le menu State
  this.game.load.image('city_bg','images/cyberpunk-street.png');
  //this.game.load.image('color_bg','images/color_bg.png');
  //this.game.load.image('overlay_bg','images/overlay_bg.png');

  //charge l'audio du menu
  this.game.load.audio('menu',['images/menu.ogg','images/menu.mp3']);
};

preloader.create = function () {
  this.game.state.start('mainMenu');
};

module.exports = preloader;