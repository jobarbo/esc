var _ = require('lodash');
var properties = require('./properties');

var states = {
  boot: require('./states/boot.js'),
  preloader: require('./states/preloader.js'),
  menu: require('./states/menu.js'),
  level1: require('./states/level1.js')
};

var game = new Phaser.Game(properties.size.x, properties.size.y, Phaser.AUTO);


// Automatically register each state.
_.each(states, function(state, key) {
  game.state.add(key, state);
});

game.state.start('boot');
