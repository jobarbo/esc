var preloader = {};

preloader.preload = function () {
  //this.game.load.image('logo', 'images/phaser.png');

  //ajoute un libelle qui indique le chargement dans le canvas
  var loadingLabel = this.game.add.text(this.game.width / 2, 150, 'chargement...', {
    font: '30px pixel',
    fill: '#ffffff'
  });
  loadingLabel.anchor.setTo(0.5, 0.5);

  //affiche la berre de progres en utilisant la progression de boot.js
  var progressBar = this.game.add.sprite(this.game.width / 2, 200, 'progressBar');
  progressBar.anchor.setTo(0.5, 0.5);
  this.game.load.setPreloadSprite(progressBar);

  //charge le joueur
  this.game.load.spritesheet('player','images/pixel_perso.png',21,21);
  //et le reste des images : enemy
  this.game.load.image('enemy','images/enemyFloating_1.png');
  this.game.load.image('enemy_death','images/enemyFloating_4.png');

  //bouton mute sur le menu principale
  this.game.load.spritesheet('mute','images/muteButton.png',28,22);

  //preload tilemap
  this.game.load.tilemap('niveau1', 'images/niveau1.json', null, Phaser.Tilemap.TILED_JSON);

  //  Next we load the tileset. This is just an image, loaded in via the normal way we load images:
  this.game.load.image('pixel','images/pixel.png');

  //charge le background pour le menu State
  this.game.load.image('city_bg','images/city.png');
  this.game.load.image('color_bg','images/color_bg.png');
  this.game.load.image('overlay_bg','images/overlay_bg.png');

  //charge l'audio du menu
  this.game.load.audio('menu',['images/menu.ogg','images/menu.mp3']);
};

preloader.create = function () {
  this.game.state.start('menu');
};

module.exports = preloader;