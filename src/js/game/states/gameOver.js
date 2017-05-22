var gameOver = {};
var muteButton;

gameOver.create = function () {
    //this.game.add.image(0, 0, 'color_bg');
    //city = this.game.add.image(0, 0, 'city_bg');
    //city.scale.setTo(1.5,1.5);
    this.game.stage.backgroundColor = '#fff'
    //this.game.add.image(0, 0, 'overlay_bg');
    gameOverMusic = this.game.add.audio('gameOverMusic'); // add the music
    gameOverMusic.loop = true; //make it loop
    gameOverMusic.fadeIn(50);
    gameOverMusic.play(); //start the music

    //affiche le nom du jeu
    var nameLabel = this.game.add.text(this.game.width / 2, -50, 'Game Over', {
        font: '24px pixelSmall',
        fill: '#000',
        align: 'center'
    });
    nameLabel.anchor.setTo(0.5, 0.5);
    this.game.add.tween(nameLabel).to({
        y: 80
    }, 1000).easing(Phaser.Easing.Bounce.Out).start();

    returnMenuLabel = this.game.add.text(this.game.width / 2, this.game.height - 110, 'Retourner au menu principal', {
        font: '13px smallest',
        fill: '#000',
        align: 'center'
    });
    returnMenuLabel.anchor.setTo(0.5, 0.5);
    returnMenuLabel.inputEnabled = true;
    returnMenuLabel.events.onInputOver.add(this.mouseOver, returnMenuLabel);
    returnMenuLabel.events.onInputOut.add(this.mouseOut, returnMenuLabel);
    returnMenuLabel.events.onInputDown.add(this.restartGame, this);

    //ajout du bouton qui fait appel a la fonction toggleSound
    muteButton = this.game.add.text(20, 20, 'mute', {
        font: '13px smallest',
        fill: '#000',
        align: 'center'
    });
    muteButton.id = 'mute';
    muteButton.inputEnabled = true;
    muteButton.events.onInputOver.add(this.mouseOver, muteButton);
    muteButton.events.onInputOut.add(this.mouseOut, muteButton);

    this.game.physics.arcade.enable(muteButton);
    muteButton.events.onInputDown.add(this.toggleSound, this);
    
    // Best score
    if (!localStorage.getItem('niveau')) {
        // Then set the best score to 0
        localStorage.setItem('niveau', 0);
    }
    if (this.game.global.levelID > localStorage.getItem('niveau')) {
        localStorage.setItem('niveau', this.game.global.levelID);
    }

    if (this.game.sound.mute) {
        //change le frame du button
        muteButton.text = 'unmute';
    }


    if (!this.game.device.desktop) {
        this.game.input.onDown.add(this.restartGame, this);
    }
};
gameOver.restartGame = function () {
    gameOverMusic.stop();
    this.game.state.start('mainMenu');

}

gameOver.mouseOver = function (textLabel) {
    textLabel.fill = "#565656";
    this.game.canvas.style.cursor = 'pointer';
}


gameOver.mouseOut = function (textLabel) {
    textLabel.fill = "#000";
    this.game.canvas.style.cursor = 'inherit';
}

gameOver.toggleSound = function () {
    //change la variable de vrai a faux ou vice versa
    //quand 'game.sound.mute = true', Phaser va muter le jeu
    this.game.sound.mute = !this.game.sound.mute;

    if (this.game.sound.mute) {
        //change le frame du button
        muteButton.text = 'unmute';
    } else {
        muteButton.text = 'mute';
    }
}


module.exports = gameOver;