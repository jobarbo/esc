var gameOver = {};

gameOver.create = function () {
    //this.game.add.image(0, 0, 'color_bg');
    //city = this.game.add.image(0, 0, 'city_bg');
    //city.scale.setTo(1.5,1.5);
    this.game.stage.backgroundColor = '#000000'
    //this.game.add.image(0, 0, 'overlay_bg');
    this.music = this.game.add.audio('menu'); // add the music
    this.music.loop = true; //make it loop
    //this.music.play(); //start the music

    //affiche le nom du jeu
    var nameLabel = this.game.add.text(this.game.width / 2, -50, 'Game Over', {
        font: '24px pixelSmall',
        fill: '#ffffff',
        align: 'center'
    });
    nameLabel.anchor.setTo(0.5, 0.5);
    this.game.add.tween(nameLabel).to({
        y: 80
    }, 1000).easing(Phaser.Easing.Bounce.Out).start();

    returnMenuLabel = this.game.add.text(this.game.width / 2, this.game.height - 110, 'Retourner au menu principal', {
        font: '10px smallest',
        fill: '#ffffff',
        align: 'center'
    });
    returnMenuLabel.anchor.setTo(0.5, 0.5);
    returnMenuLabel.inputEnabled = true;
    returnMenuLabel.events.onInputOver.add(this.mouseOver, returnMenuLabel);
    returnMenuLabel.events.onInputOut.add(this.mouseOut, returnMenuLabel);
    returnMenuLabel.events.onInputDown.add(this.restartGame, this);


    //ajout du bouton qui fait appel a la fonction toggleSound
    this.muteButton = this.game.add.button(20, 20, 'mute', this.toggleSound, this);

    //si le jeu est deja sans son, afficher le speaker mute
    this.muteButton.frame = this.game.sound.mute ? 1 : 0;
    

    if (!this.game.device.desktop) {
        this.game.input.onDown.add(this.restartGame, this);
    }
};
gameOver.restartGame = function () {
    this.game.state.start('mainMenu');
}

gameOver.mouseOver = function (textLabel) {
    textLabel.fill = "#ffff44";
    this.game.canvas.style.cursor = 'pointer';
}


gameOver.mouseOut = function (textLabel) {
    textLabel.fill = "#ffffff";
    this.game.canvas.style.cursor = 'inherit';
}

gameOver.toggleSound = function () {
    //change la variable de vrai a faux ou vice versa
    //quand 'game.sound.mute = true', Phaser va muter le jeu
    this.game.sound.mute = !this.game.sound.mute;

    //change le frame du button
    this.muteButton.frame = this.game.sound.mute ? 1 : 0;
}


module.exports = gameOver;