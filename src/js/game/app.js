var _ = require('lodash');
var properties = require('./properties');
var manager;
var bounds;


var states = {
  boot: require('./states/boot.js'),
  preloader: require('./states/preloader.js'),
  mainMenu: require('./states/mainMenu.js'),
  levelSelector: require('./states/levelSelector.js'),
  level1: require('./states/level1.js')
};

var game = new Phaser.Game(properties.size.x, properties.size.y, Phaser.AUTO, '', null, false, false);



// Automatically register each state.
_.each(states, function(state, key) {
  game.state.add(key, state);
});

game.state.start('boot');
