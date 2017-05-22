var tutorial = {};

tutorial.create = function () {
    map = this.game.add.tilemap('tutorial');
    map.addTilesetImage('pixelui', 'pixelui');
    controlUi = map.createLayer('controls');

    mapObjectNameArray = [];
    mapObjectBasicArray = map.objects.position;
    mapObjectBasicArray.forEach(function (mapObjectBasicArray) {
        //a moi meme: check donc si tu peux leur créé un id pis l'envoyer
        mapObjectNameArray.push(mapObjectBasicArray.name);
    });
    for (i = 0; i <= mapObjectNameArray.length; i++) {
        if (mapObjectNameArray[i] == 'text1') {
            text1 = map.objects.position[i]
            this.text1Rect = new Phaser.Rectangle(text1.x, text1.y, text1.width, text1.height);
        }
        if (mapObjectNameArray[i] == 'text2') {
            text2 = map.objects.position[i]
            this.text2Rect = new Phaser.Rectangle(text2.x, text2.y, text2.width, text2.height);
        }
        if (mapObjectNameArray[i] == 'text3') {
            text3 = map.objects.position[i]
            this.text3Rect = new Phaser.Rectangle(text3.x, text3.y, text3.width, text3.height);
        }
    }

    //affiche le nom du jeu
    var firstText = this.game.add.text(text1.x, text1.y, '1. Utiliser la touche haut\n pour sauter. (deux fois!)\n2. gauche/droite pour naviguer', {
        font: '9px smallest',
        fill: '#0000',
        align: 'left'
    });

    firstText.lineSpacing = -5;

    //affiche le nom du jeu
    var secondText = this.game.add.text(text2.x, text2.y, '3. Utiliser la touche espace\npour activer les intérrupteurs', {
        font: '9px smallest',
        fill: '#000',
        align: 'left'
    });

    secondText.lineSpacing =-5;

    //affiche le nom du jeu
    var thirdText = this.game.add.text(text3.x, text3.y, '4. Mais surtout, ne vous faites pas prendre par la sentinele', {
        font: '9px smallest',
        fill: '#fff',
        align: 'center'
    });
    thirdText.lineSpacing =-5;
    //affiche le nom du jeu
    var returnMainTitle = this.game.add.text(this.game.width/2, text3.y+30, 'Retourner au Menu Principal', {
        font: '13px smallest',
        fill: '#000',
        align: 'center'
    });
    returnMainTitle.anchor.setTo(0.5,0.5);
    returnMainTitle.inputEnabled = true;
    returnMainTitle.events.onInputOver.add(this.mouseOver, returnMainTitle);
    returnMainTitle.events.onInputOut.add(this.mouseOut, returnMainTitle);
    returnMainTitle.events.onInputDown.add(this.returnToMainTitle, this);

    menuMusic = this.game.add.audio('mainMenu'); // add the music
    menuMusic.loop = true; //make it loop
    menuMusic.play(); //start the music

};

tutorial.returnToMainTitle = function(){
    this.game.state.start('mainMenu');
    menuMusic.stop(); //start the music
}

tutorial.mouseOver = function (textLabel) {
    textLabel.fill = "#565656";
    this.game.canvas.style.cursor = 'pointer';
}


tutorial.mouseOut = function (textLabel) {
    textLabel.fill = "#000";
    this.game.canvas.style.cursor = 'inherit';
}

tutorial.update = function () {

};

module.exports = tutorial;