var levelSelector = {};

levelSelector.create = function () {

    map = this.game.add.tilemap('levelSelect');
    map.addTilesetImage('pixelui', 'pixelui');
    levels = map.createLayer('levels');

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
        }
    }



};

levelSelector.update = function () {

};

module.exports = levelSelector;