var mainMenu = {};
var newGameLabel,nameLabel,levelSelectLabel,tutorialLabel;

mainMenu.create = function () {
    //this.game.add.image(0, 0, 'color_bg');
    //city = this.game.add.image(0, 0, 'city_bg');
    this.game.stage.backgroundColor = '#000000';
    //city.scale.setTo(1.5,1.5);
    //this.game.add.image(0, 0, 'overlay_bg');
    this.music = this.game.add.audio('menu'); // add the music
    this.music.loop = true; //make it loop
    //this.music.play(); //start the music

    this.game.input.mouse.capture = true;

    //affiche le nom du jeu
    nameLabel = this.game.add.text(this.game.width / 2, -50, 'ESC', {
        font: '30px pixelVector',
        fill: '#ffffff',
        align: 'center'
    });
    nameLabel.anchor.setTo(0.5, 0.5);

    this.game.add.tween(nameLabel).to({
        y: 80
    }, 1000).easing(Phaser.Easing.Bounce.Out).start();
    

    //text explicatif sur comment debuter le jeu
    newGameLabel = this.game.add.text(this.game.width / 2, this.game.height - 110, 'Nouvelle partie', {
        font: '10px smallest',
        fill: '#ffffff',
        align: 'center'
    });
    newGameLabel.id = 'new';
    newGameLabel.anchor.setTo(0.5, 0.5);
    newGameLabel.inputEnabled = true;
    newGameLabel.events.onInputOver.add(this.mouseOver, newGameLabel);
    newGameLabel.events.onInputOut.add(this.mouseOut, newGameLabel);

    levelSelectLabel = this.game.add.text(this.game.width / 2, this.game.height - 80, 'Choisir niveau', {
        font: '10px smallest',
        fill: '#ffffff',
        align: 'center'
    });
    levelSelectLabel.id = 'level';
    levelSelectLabel.anchor.setTo(0.5, 0.5);
    levelSelectLabel.inputEnabled = true;
    levelSelectLabel.events.onInputOver.add(this.mouseOver, levelSelectLabel);
    levelSelectLabel.events.onInputOut.add(this.mouseOut, levelSelectLabel);

    tutorialLabel = this.game.add.text(this.game.width / 2, this.game.height - 50, 'Voir tutoriel', {
        font: '10px smallest',
        fill: '#ffffff',
        align: 'center'
    });
    tutorialLabel.id = 'tutorial';
    tutorialLabel.anchor.setTo(0.5, 0.5);
    tutorialLabel.inputEnabled = true;
    tutorialLabel.events.onInputOver.add(this.mouseOver, tutorialLabel);
    tutorialLabel.events.onInputOut.add(this.mouseOut, tutorialLabel);

    //ajout du bouton qui fait appel a la fonction toggleSound
    this.muteButton = this.game.add.button(20, 20, 'mute', this.toggleSound, this);

    //si le jeu est deja sans son, afficher le speaker mute
    this.muteButton.frame = this.game.sound.mute ? 1 : 0;
    this.muteButton.scale.setTo(0.5,0.5);


    this.game.physics.arcade.enable(newGameLabel);
    this.game.physics.arcade.enable(levelSelectLabel);
    this.game.physics.arcade.enable(nameLabel);

    //cree une nouvelle variable Phaser keyboard : la fleche haut
    //lorsque pesee elle apelle Start
    newGameLabel.events.onInputDown.add(this.demarrer, this);
    levelSelectLabel.events.onInputDown.add(this.demarrer, this);
    tutorialLabel.events.onInputDown.add(this.demarrer, this);

    if (!this.game.device.desktop) {
        this.game.input.onDown.add(this.demarrer, this);
        //text explicatif sur comment debuter le jeu
        mobileNotice = this.game.add.text(this.game.width - 45, 45, 'Mode mobile', {
            font: '8px smallest',
            fill: '#ffffff',
            align: 'center'
        });
        mobileNotice.anchor.setTo(1, 1);
    }
};

mainMenu.mouseOver = function (textLabel) {
    textLabel.fill = "#ffff44";
    this.game.canvas.style.cursor = 'pointer';
}


mainMenu.mouseOut = function (textLabel) {
    textLabel.fill = "#ffffff";
    this.game.canvas.style.cursor = 'inherit';
}

mainMenu.toggleSound = function () {
    //change la variable de vrai a faux ou vice versa
    //quand 'game.sound.mute = true', Phaser va muter le jeu
    this.game.sound.mute = !this.game.sound.mute;

    //change le frame du button
    this.muteButton.frame = this.game.sound.mute ? 1 : 0;
}

mainMenu.render = function () {

    //this.game.debug.body(nameLabel);
    //this.game.debug.body(levelSelectLabel);
}

mainMenu.demarrer = function (args) {

    //Si lon tappe sur le coin haut gauche sur mobile
    if (!this.game.device.desktop && this.game.input.y < 50 && this.game.input.x < 60) {
        // cela veux dire que l'usager veux muter le son et pas demarrer le jeu
        return;

    }
    //demarre le jeu
    //arrete la musique
    this.music.stop();
    if(args.id == 'new'){this.game.state.start('level1');}
    if(args.id == 'level'){this.game.state.start('levelSelector');}
    if(args.id == 'tutorial'){this.game.state.start('tutorial');}
    //this.game.state.start('level1');

};



module.exports = mainMenu;