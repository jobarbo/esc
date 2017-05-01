var Stats = require('../../lib/stats.min');
var properties = require('../properties');
var boot = {};

boot.init = function () {
  this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; 
 //centre le jeu sur l'ecran de l'appareil
  this.game.scale.pageAlignHorizontally = true;
  this.game.scale.pageAlignVertically = true;
  this.game.stage.smoothed = false;
}

boot.preload = function() {
  //chargement de l'image pour la barre de chargement
  this.game.load.image('progressBar','images/progressBar.png')
}

boot.create = function () {

  if (properties.showStats) {
    addStats(this.game);
  }

  this.game.stage.backgroundColor = '#3498db';
  
  //initialisation des physiques complexe
  this.game.physics.startSystem(Phaser.Physics.P2JS);
  this.game.renderer.renderSession.roundPixels = true;

 

  //ajoute une couleur a la page pour cacher les espace blanc
  document.body.style.backgroundColor = '#142A53';

  if(!this.game.device.desktop) {

    //initialise le max et le min des dimensions du jeu
    this.game.scale.setMinMax(game.width/2,game.height/2,game.width*2,game.height*2);

  }

  this.game.state.start('preloader');
};

function addStats(game) {

  var stats = new Stats();

  stats.setMode(0);

  stats.domElement.style.position = 'absolute';
  stats.domElement.style.right = '0px';
  stats.domElement.style.top = '0px';

  document.body.appendChild(stats.domElement);

  // Monkey patch Phaser's update in order to correctly monitor FPS.
  var oldUpdate = game.update;
  game.update = function() {
    stats.begin();
    oldUpdate.apply(game, arguments);
    stats.end();
  };
}

module.exports = boot;
