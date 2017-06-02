var preloader = {};

preloader.preload = function () {
  //this.game.load.image('logo', 'images/phaser.png');

  //ajoute un libelle qui indique le chargement dans le canvas
  var loadingLabel = this.game.add.text(this.game.width / 2, 100, 'chargement...', {
    font: '25px smallest',
    fill: '#ffffff'
  });
  loadingLabel.anchor.setTo(0.5, 0.5);

  //affiche la berre de progres en utilisant la progression de boot.js
  var progressBar = this.game.add.sprite(this.game.width / 2, 150, 'progressBar');
  //progressBar.scale.setTo(0.8, 0.8);
  progressBar.anchor.setTo(0.5, 0.5);
  this.game.load.setPreloadSprite(progressBar);
  this.game.stage.backgroundColor = "#000000";

  //charge le titre
  this.game.load.image('logo', 'images/logo.png');

  //charge le joueur
  this.game.load.spritesheet('player', 'images/pixel_perso.png', 21, 21);

  //charge la clef
  this.game.load.spritesheet('key','images/key.png',21,21);

  //et le reste des images : enemy
  this.game.load.image('enemy', 'images/enemy.png');
  this.game.load.image('enemy_death', 'images/enemy_dead.png');

  this.game.load.image('laser', 'images/laser.png');

  this.game.load.image('door', 'images/door.png');

  //bouton mute sur le menu principale
  this.game.load.spritesheet('mute', 'images/muteButton.png', 28, 22);

  //preload all tilemap
  this.game.load.tilemap('tutorial', 'levels/tutorial.json', null, Phaser.Tilemap.TILED_JSON);
  this.game.load.tilemap('test','levels/niveautest.json',null, Phaser.Tilemap.TILED_JSON);
  this.game.load.tilemap('niveau1', 'levels/niveau1.json', null, Phaser.Tilemap.TILED_JSON);
  this.game.load.tilemap('niveau2', 'levels/niveau2.json', null, Phaser.Tilemap.TILED_JSON);
  this.game.load.tilemap('niveau3', 'levels/niveau3.json', null, Phaser.Tilemap.TILED_JSON);
  this.game.load.tilemap('niveau4', 'levels/niveau4.json', null, Phaser.Tilemap.TILED_JSON);
  this.game.load.tilemap('levelSelect', 'levels/levelSelect.json', null, Phaser.Tilemap.TILED_JSON);

  //preload particle
  this.game.load.image('splat', 'images/redParticle.jpeg');

  //chargement des assets pour l'ajout des bouton touch
  this.game.load.image('jumpButton', 'images/jumpButton.png');
  this.game.load.image('rightButton', 'images/rightButton.png');
  this.game.load.image('leftButton', 'images/leftButton.png');

  //  Next we load the tileset. This is just an image, loaded in via the normal way we load images:
  this.game.load.image('pixel', 'images/pixel.png');
  this.game.load.image('pixelui', 'images/pixelui.png');

  //charge le background pour le menu State
  this.game.load.image('city_bg', 'images/cyberpunk-street.png');

  //charge l'audio du jeu
  this.game.load.audio('music', ['audio/evasion.mp3']);
  //charge l'audio du menu Game Over
  this.game.load.audio('gameOverMusic', ['audio/bittersweet.mp3']);
  //charge l'audio du menu
  this.game.load.audio('mainMenu', ['audio/mainMenu.mp3']);

  // charge le son
  // le son du joueur qui saute
  this.game.load.audio('jump',['audio/jump.mp3']);

    // le son du joueur qui atteris
  this.game.load.audio('landing',['audio/herolanding.mp3']);

    //le son du joueur qui court
  this.game.load.audio('run',['audio/walk.mp3']);

   //le son du joueur qui ouvre la porte
  this.game.load.audio('door',['audio/door.mp3']);

  //le son du joueur qui prend une piece
  this.game.load.audio('key',['audio/coin.mp3']);

  //le son du sentinel qui detecte le joueur
  this.game.load.audio('alert',['audio/alert.mp3']);

  //le son du sentinel qui tire
  this.game.load.audio('ray',['audio/ray.mp3']);

  //le son du joueur qui meurt
  this.game.load.audio('dead',['audio/squish.mp3']);
};

preloader.create = function () {
  this.game.state.start('mainMenu');
};

module.exports = preloader;