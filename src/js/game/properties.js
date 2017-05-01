var npmProperties = require('../../../package.json');
//var height = window.innerHeight;
module.exports = {
  title: 'Phaser JS Boilerplate',
  description: npmProperties.description,
  port: 3017,
  liveReloadPort: 3018,
  mute: false,
  showStats: true,
  size: {
    x: 315,
    y: 252
  },
  analyticsId: 'UA-50892214-2'
};
