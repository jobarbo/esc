var _ = require('lodash');
var properties = require('./properties');
var manager;
var bounds;


var states = {
  boot: require('./states/boot.js'),
  preloader: require('./states/preloader.js'),
  mainMenu: require('./states/mainMenu.js'),
  gameOver: require('./states/gameOver.js'),
  levelSelector: require('./states/levelSelector.js'),
  tutorial: require('./states/tutorial.js'),
  level: require('./states/level.js')
};

var game = new Phaser.Game(properties.size.x, properties.size.y, Phaser.AUTO, '', null, false, false);
game.global = {
  levelID: 0
}

// Automatically register each state.
_.each(states, function(state, key) {
  game.state.add(key, state);
});

game.state.start('boot');
