var levelSelector = {};

levelSelector.create = function () {

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
    for (i = 0; i <= mapObjectIndexArray.length; i++) {
        if (mapObjectIndexArray[i] == i) {
            positionArray.push(map.objects.position[i]);
            var levelLabel = this.game.add.text(positionArray[i].x - 5, positionArray[i].y - 5, 'Niveau\n' + i, {
                font: '10px smallest',
                fill: '#ffffff',
                align: 'center'
           
            });
            labelArray.push(levelLabel);
            this.game.physics.arcade.enable(labelArray[i]);
            labelArray[i].inputEnabled = true;
            labelArray[i].id=i;
            labelArray[i].events.onInputOver.add(this.mouseOver, labelArray[i]);
            labelArray[i].events.onInputOut.add(this.mouseOut, labelArray[i]);
            labelArray[i].events.onInputDown.add(this.demarrer, labelArray[i]);
        }
    }

};

levelSelector.demarrer = function(level){
    levelSelected = level.id;
    this.game.global.levelID = levelSelected;
    this.game.state.start('level')
}

levelSelector.mouseOver = function (textLabel) {
    textLabel.fill = "#ffff44";
    this.game.canvas.style.cursor = 'pointer';
}


levelSelector.mouseOut = function (textLabel) {
    textLabel.fill = "#ffffff";
    this.game.canvas.style.cursor = 'inherit';
}

levelSelector.update = function () {

};

module.exports = levelSelector;