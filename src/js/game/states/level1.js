var level1 = {};

level1.create = function () {

    this.game.add.image(0, 0, 'color_bg');
    this.game.add.image(0, 0, 'city_bg');
    this.game.add.image(0, 0, 'overlay_bg');

    //affiche le nom du jeu
    var testLabel = this.game.add.text(this.game.width / 2, -50, 'Le Jeu Démarre', {
        font: '70px Geo',
        fill: '#ffffff'
    });
    testLabel.anchor.setTo(0.5, 0.5);

    this.game.add.tween(testLabel).to({
        y: 80
    }, 1000).easing(Phaser.Easing.Bounce.Out).start();

};

level1.update = function () {

};

module.exports = level1;