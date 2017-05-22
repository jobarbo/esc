var levelSelector = {};

levelSelector.create = function () {
    niveauSauvegarder = localStorage.getItem('niveau');

    map = this.game.add.tilemap('levelSelect');
    map.addTilesetImage('pixelui', 'pixelui');
    levels = map.createLayer('levels');

    labelArray = [];
    positionArray = [];
    mapObjectIndexArray = [];
    mapObjectBasicArray = map.objects.position;
    mapObjectBasicArray.forEach(function (mapObjectBasicArray) {
        //a moi meme: check donc si tu peux leur créé un id pis l'envoyer
        mapObjectIndexArray.push(mapObjectBasicArray.properties.index);
    });
    for (i = 0; i <= niveauSauvegarder; i++) {
        if (mapObjectIndexArray[i] == i) {
            positionArray.push(map.objects.position[i]);
            var levelLabel = this.game.add.text(positionArray[i].x - 5, positionArray[i].y - 5, 'Niveau\n' + i, {
                font: '10px smallest',
                fill: '#000',
                align: 'center'

            });
            labelArray.push(levelLabel);
            this.game.physics.arcade.enable(labelArray[i]);
            labelArray[i].inputEnabled = true;
            labelArray[i].id = i;
            labelArray[i].events.onInputOver.add(this.mouseOver, labelArray[i]);
            labelArray[i].events.onInputOut.add(this.mouseOut, labelArray[i]);
            labelArray[i].events.onInputDown.add(this.demarrer, labelArray[i]);
        }
    }
    var returnMainTitle = this.game.add.text(this.game.width / 2, this.game.height - 15, 'Retourner au Menu Principal', {
        font: '13px smallest',
        fill: '#000',
        align: 'center'
    });
    returnMainTitle.anchor.setTo(0.5, 0.5);
    returnMainTitle.inputEnabled = true;
    returnMainTitle.events.onInputOver.add(this.mouseOver, returnMainTitle);
    returnMainTitle.events.onInputOut.add(this.mouseOut, returnMainTitle);
    returnMainTitle.events.onInputDown.add(this.returnToMainTitle, this);


    menuMusic = this.game.add.audio('mainMenu'); // add the music
    menuMusic.loop = true; //make it loop
    menuMusic.play(); //start the music

};

levelSelector.demarrer = function (level) {
    levelSelected = level.id;
    this.game.global.levelID = levelSelected;
    this.game.state.start('level')
    menuMusic.stop();
}

levelSelector.returnToMainTitle = function () {
    this.game.state.start('mainMenu');
    menuMusic.stop();
}

levelSelector.mouseOver = function (textLabel) {
    textLabel.fill = "#565656";
    this.game.canvas.style.cursor = 'pointer';
}


levelSelector.mouseOut = function (textLabel) {
    textLabel.fill = "#000";
    this.game.canvas.style.cursor = 'inherit';
}

levelSelector.update = function () {

};

module.exports = levelSelector;