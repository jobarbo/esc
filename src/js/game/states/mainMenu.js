var mainMenu = {};

mainMenu.create = function () {
    //this.game.add.image(0, 0, 'color_bg');
    city = this.game.add.image(0, 0, 'city_bg');
    city.scale.setTo(1.5,1.5);
    //this.game.add.image(0, 0, 'overlay_bg');
    this.music = this.game.add.audio('menu'); // add the music
    this.music.loop = true; //make it loop
    //this.music.play(); //start the music

    //affiche le nom du jeu
    var nameLabel = this.game.add.text(this.game.width / 2, -50, 'ESC', {
        font: '50px pixelVector',
        fill: '#ffffff'
    });
    nameLabel.anchor.setTo(0.5, 0.5);
    this.game.add.tween(nameLabel).to({
        y: 80
    }, 1000).easing(Phaser.Easing.Bounce.Out).start();

    var text;
    if (this.game.device.desktop) {
        text = 'Peser sur ESPACE pour démarrer';
    } else {
        text = "Toucher l'écran pour démarrer";
    }

    //text explicatif sur comment debuter le jeu
    var startLabel = this.game.add.text(this.game.width / 2, this.game.height - 80, text, {
        font: '15px Arial',
        fill: '#ffffff'
    });
    startLabel.anchor.setTo(0.5, 0.5);

    //ajout du bouton qui fait appel a la fonction toggleSound
    this.muteButton = this.game.add.button(20, 20, 'mute', this.toggleSound, this);

    //si le jeu est deja sans son, afficher le speaker mute
    this.muteButton.frame = this.game.sound.mute ? 1 : 0;

    //cree une nouvelle variable Phaser keyboard : la fleche haut
    //lorsque pesee elle apelle Start
    var upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    upKey.onDown.add(this.demarrer, this);

    if (!this.game.device.desktop) {
        this.game.input.onDown.add(this.demarrer, this);
    }
};

mainMenu.toggleSound = function () {
    //change la variable de vrai a faux ou vice versa
    //quand 'game.sound.mute = true', Phaser va muter le jeu
    this.game.sound.mute = !this.game.sound.mute;

    //change le frame du button
    this.muteButton.frame = this.game.sound.mute ? 1 : 0;
}

mainMenu.demarrer = function () {
    //this.game.state.start('level1');

    //Si lon tappe sur le coin haut gauche sur mobile
    if (!this.game.device.desktop && this.game.input.y < 50 && this.game.input.x < 60) {
        // cela veux dire que l'usager veux muter le son et pas demarrer le jeu
        return;

    }
    // demarre le jeu
    //arrete la musique
    this.music.stop();
    this.game.state.start('level1');
    
};

module.exports = mainMenu;