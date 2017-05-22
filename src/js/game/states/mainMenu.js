var mainMenu = {};
var newGameLabel, nameLabel, levelSelectLabel, tutorialLabel, muteButton;

mainMenu.create = function () {

    this.game.stage.backgroundColor = '#ffffff';

    menuMusic = this.game.add.audio('mainMenu'); // add the music
    menuMusic.loop = true; //make it loop
    menuMusic.play(); //start the music


    this.game.input.mouse.capture = true;

    //affiche le nom du jeu
    logo = this.game.add.image(this.game.width / 2, -50, 'logo');

    logo.anchor.setTo(0.5, 0.5);

    this.game.add.tween(logo).to({
        y: 80
    }, 1000).easing(Phaser.Easing.Bounce.Out).start();


    //text explicatif sur comment debuter le jeu
    newGameLabel = this.game.add.text(this.game.width / 2, this.game.height - 90, 'Nouvelle partie', {
        font: '13px smallest',
        fill: '#000',
        align: 'center'
    });
    newGameLabel.id = 'new';
    newGameLabel.anchor.setTo(0.5, 0.5);
    newGameLabel.inputEnabled = true;
    newGameLabel.events.onInputOver.add(this.mouseOver, newGameLabel);
    newGameLabel.events.onInputOut.add(this.mouseOut, newGameLabel);

    levelSelectLabel = this.game.add.text(this.game.width / 2, this.game.height - 60, 'Choisir niveau', {
        font: '13px smallest',
        fill: '#000',
        align: 'center'
    });
    levelSelectLabel.id = 'level';
    levelSelectLabel.anchor.setTo(0.5, 0.5);
    levelSelectLabel.inputEnabled = true;
    levelSelectLabel.events.onInputOver.add(this.mouseOver, levelSelectLabel);
    levelSelectLabel.events.onInputOut.add(this.mouseOut, levelSelectLabel);

    tutorialLabel = this.game.add.text(this.game.width / 2, this.game.height - 30, 'Voir tutoriel', {
        font: '13px smallest',
        fill: '#000',
        align: 'center'
    });
    tutorialLabel.id = 'tutorial';
    tutorialLabel.anchor.setTo(0.5, 0.5);
    tutorialLabel.inputEnabled = true;
    tutorialLabel.events.onInputOver.add(this.mouseOver, tutorialLabel);
    tutorialLabel.events.onInputOut.add(this.mouseOut, tutorialLabel);

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


    this.game.physics.arcade.enable(newGameLabel);
    this.game.physics.arcade.enable(levelSelectLabel);
    this.game.physics.arcade.enable(tutorialLabel);
    this.game.physics.arcade.enable(logo);
    this.game.physics.arcade.enable(muteButton);


    //cree une nouvelle variable Phaser keyboard : la fleche haut
    //lorsque pesee elle apelle Start
    newGameLabel.events.onInputDown.add(this.demarrer, this);
    levelSelectLabel.events.onInputDown.add(this.demarrer, this);
    tutorialLabel.events.onInputDown.add(this.demarrer, this);
    muteButton.events.onInputDown.add(this.toggleSound, this);

    if (this.game.sound.mute) {
        //change le frame du button
        muteButton.text = 'unmute';
    }
    // verifie la progression enregistré sur le navigateur local
    if (!localStorage.getItem('niveau')) {
        // configure le jeu comme nouvellement ouvert donc aucun niveau de disponible sauf le premier
        localStorage.setItem('niveau', 0);
    }
    if (this.game.global.levelID > localStorage.getItem('niveau')) {
        localStorage.setItem('niveau', this.game.global.levelID);
    }
     console.log(localStorage);

    if (!this.game.device.desktop) {
        //text explicatif sur comment debuter le jeu
        mobileNotice = this.game.add.text(this.game.width - 45, 45, 'Mode mobile', {
            font: '8px smallest',
            fill: '#000',
            align: 'center'
        });
        mobileNotice.anchor.setTo(1, 1);
    }
};

mainMenu.mouseOver = function (textLabel) {
    textLabel.fill = "#565656";
    this.game.canvas.style.cursor = 'pointer';
}


mainMenu.mouseOut = function (textLabel) {
    textLabel.fill = "#000";
    this.game.canvas.style.cursor = 'inherit';
}

mainMenu.toggleSound = function () {
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


mainMenu.demarrer = function (args) {

    //Si lon tappe sur le coin haut gauche sur mobile
    if (!this.game.device.desktop && this.game.input.y < 50 && this.game.input.x < 60) {
        // cela veux dire que l'usager veux muter le son et pas demarrer le jeu
        return;

    }
    //demarre le jeu
    //arrete la musique
    menuMusic.stop();
    if (args.id == 'new') {
        this.game.state.start('level');
        menuMusic.stop();
    }
    if (args.id == 'level') {
        this.game.state.start('levelSelector');
    }
    if (args.id == 'tutorial') {
        this.game.state.start('tutorial');
    }

};



module.exports = mainMenu;