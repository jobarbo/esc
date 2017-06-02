var level = {};
var currentLevel;
var map, keySound, music, jumpSound, deadSound, runSound, doorSound, collisionLayer, player, key, door, gotKey, emitter, particles, cursors, hourGlassVariable, laser, rayCastTimer, jumpCount, jumpkey, theGame, playerScale, levelText, helpTextTween, helpText, heroLanding, raycasting, mapObjectNameArray, hitPlatform, enemyTween, hasFired, playerVisible, lightBitmap;
var ray;
var tileHits = [];
level.create = function () {
    currentLevel = this.game.global.levelID;
    //configure la tilemap
    //map = this.game.add.tilemap('test');
    //levelText = 'Appuyez sur la touche GAUCHE/DROITE pour naviguer\nVous devez prendre la clef pour ouvrir la porte';
    if (currentLevel == 0) {
        map = this.game.add.tilemap('niveau1');
        levelText = 'Appuyez sur la touche GAUCHE/DROITE pour naviguer\nVous devez prendre la clef pour ouvrir la porte';
    }
    if (currentLevel == 1) {
        map = this.game.add.tilemap('niveau2');
        levelText = 'Ne vous faites pas voir pas les rayon du SENTINEL';
    }
    if (currentLevel == 2) {
        map = this.game.add.tilemap('niveau3');
        levelText = 'Appuyer sur SPACEBAR ou HAUT pour sauter (x2)';
    }
    if (currentLevel == 3) {
        map = this.game.add.tilemap('niveau4');
        //levelText = 'Ne vous faites pas voir pas les rayon du sentinel';
    }
   

    map.addTilesetImage('pixel', 'pixel');
    fargroundLayer = map.createLayer('farground');
    backgroundLayer = map.createLayer('background');
    falseCollisionLayer = map.createLayer('platform');
    collisionLayer = map.createLayer('platform');
    interactiveLayer = map.createLayer('interactive');

    mapIntersectNameArray = [];
    mapIntersectBasicArray = map.objects.lightIntersect;
    mapIntersectBasicArray.forEach(function (mapIntersectBasicArray) {
        mapIntersectNameArray.push(mapIntersectBasicArray);
    });

    console.log(mapIntersectNameArray.length);

    mapObjectNameArray = [];
    mapObjectBasicArray = map.objects.evenement;
    mapObjectBasicArray.forEach(function (mapObjectBasicArray) {
        mapObjectNameArray.push(mapObjectBasicArray.name);
    });
    // extraction des objet interactifs qui se trouve dans le tile map
    hourGlassVariable = 0;
    for (i = 0; i <= mapObjectNameArray.length; i++) {
        if (mapObjectNameArray[i] == 'begin') {
            begin = map.objects.evenement[i]
            this.beginRect = new Phaser.Rectangle(begin.x, begin.y, begin.width, begin.height);
        }
        if (mapObjectNameArray[i] == 'exit') {
            exit = map.objects.evenement[i]
            this.exitRect = new Phaser.Rectangle(exit.x, exit.y, exit.width, exit.height);
        }
        if (mapObjectNameArray[i] == 'enemyBegin') {
            enemyBegin = map.objects.evenement[i]
            this.enemyBeginRect = new Phaser.Rectangle(enemyBegin.x, enemyBegin.y, enemyBegin.width, enemyBegin.height);
        }
        if (mapObjectNameArray[i] == 'switch') {
            keyPosition = map.objects.evenement[i]
            this.keyPositionRect = new Phaser.Rectangle(keyPosition.x, keyPosition.y, keyPosition.width, keyPosition.height);
        }
        if (mapObjectNameArray[i] == 'enemyStop1') {
            enemyStop1 = map.objects.evenement[i]
            this.enemyStop1Rect = new Phaser.Rectangle(enemyStop1.x, enemyStop1.y, enemyStop1.width, enemyStop1.height);
        }
        if (mapObjectNameArray[i] == 'enemyEnd') {
            enemyEnd = map.objects.evenement[i]
            this.enemyEndRect = new Phaser.Rectangle(enemyEnd.x, enemyEnd.y, enemyEnd.width, enemyEnd.height);
        }
    }

    //charle le sprite et position la porte
    door = this.game.add.sprite(exit.x, exit.y, 'door');

    //charge le sprite du joueur et le positionne au point de depart
    player = this.game.add.sprite(begin.x + 10, begin.y + begin.height, 'player');
    player.alpha = 0;

    var appear = this.game.add.tween(player).to({
        alpha: 1
    }, 1000, "Sine.easeInOut", true, 0);
    //appear.yoyo(true,50);
    //animation du personnage cycle de marche
    player.animations.add('left', [0, 1], 10, true);
    player.animations.add('right', [0, 1], 10, true);
    player.anchor.setTo(0.5, 0.5);

    //configuration de propriété physique du joueur
    this.game.physics.arcade.enable(player);
    player.body.collideWorldBounds = false;
    player.body.gravity.y = 300;

    //sers a inversé le sprite lors du changement de direction du joueur
    player.scale.setTo(1, 1);
    playerScale = player.scale.x;

    key = this.game.add.sprite(keyPosition.x, keyPosition.y, 'key');
    key.animations.add('keyAnim', [0, 0, 0, 0, 0, 0, 1, 2, 3, 4], 10, true);
    var keyFloat = this.game.add.tween(key).to({
        y: key.y - 2
    }, 500, "Sine.easeInOut", true, 0, -1);
    keyFloat.yoyo(true, 0);

    //ajoute le moteur physique au collectible
    this.game.physics.arcade.enable(key);
    gotKey = false;

    //genere les sprite de particule
    emitter = this.game.add.emitter(0, 0, 100);
    emitter.makeParticles('splat');
    particles = emitter.children;

    this.game.physics.arcade.enable(emitter);
    emitter.enableBody = true;
    emitter.gravity = 100;
    emitter.minRotation = 0;
    emitter.maxRotation = 0;
    emitter.bounce.setTo(0.5, 0.5);
    emitter.setXSpeed(-50, 50);
    emitter.setYSpeed(-50, 50);
    emitter.minParticleScale = 0.2;
    emitter.maxParticleScale = 0.3;
    emitter.particleDrag.x = 50;

    //appele le layer de premier plan pour les décors
    foregroundLayer = map.createLayer('foreground');

    // creation d'une texture bitmap qui va dessiné les cones ''lumiere''
    this.bitmap = this.game.add.bitmapData(map.widthInPixels, map.heightInPixels);
    this.bitmap.context.fillStyle = 'rgb(255, 255, 255)';
    this.bitmap.context.strokeStyle = 'rgb(255, 255, 255)';
    lightBitmap = this.game.add.image(0, 0, this.bitmap);
    lightBitmap.blendMode = Phaser.blendModes.MULTIPLY;

    // cration d'un bitmap pour dessiné les ''rayon''
    this.rayBitmap = this.game.add.bitmapData(map.widthInPixels, map.heightInPixels);
    this.rayBitmapImage = this.game.add.image(0, 0, this.rayBitmap);
    this.rayBitmapImage.visible = false;

    // Setup function for hiding or showing rays
    //this.game.input.onTap.add(this.toggleRays, this);

    collisionLayer.visible = false;
    collisionLayer.debug = false;

    //ajoute les collision par exclusion de du calque de collision 
    map.setCollisionByExclusion([], true, collisionLayer);
    collisionLayer.resizeWorld();
    collisionLayer.collideWorldBounds = false;
    backgroundLayer.resizeWorld();


    collisionData = collisionLayer.layer.data;
    collisionChildData = [];

    /*for (i = 0; i < collisionData.length; i++) {
        for (z = 0; z < collisionData[i].length; z++) {
            if (collisionData[i][z].canCollide) {
                collisionChildData.push(collisionData[i][z]);
            }
        }
    }*/

    for (i = 0; i < mapIntersectNameArray.length; i++) { 
        collisionChildData.push(mapIntersectNameArray[i]);
    }

    console.log(collisionChildData);


    //Configure le compteur de saut pour créé un doule saut
    jumpCount = 0;
    jumpkey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
    altJumpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    spaceJumpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    //configure le comportement de la camera
    this.game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);

    hasFired = false;
    //charge les sprite de l'ennemi
    enemy = this.game.add.sprite(enemyBegin.x, enemyBegin.y, 'enemy');
    enemy.anchor.setTo(0.5);

    laser = this.game.add.sprite(enemy.x, enemy.y, 'laser');
    laser.anchor.setTo(0.5);
    this.game.physics.arcade.enable(laser);
    laser.body.enable = true;

    //  active les physique pour le laser
    this.game.physics.enable(laser, Phaser.Physics.ARCADE);
    laser.body.allowRotation = false;
    laser.visible = false;

    //  Create our Timer
    deathTimer = this.game.time.create(false);
    deathTimer.loop(200, this.fireDeathRay, this).autoDestroy = true;

    //
    restartTweenTimer = this.game.time.create(false);
    restartTweenTimer.loop(2000, this.restartEnemyMovement, this).autoDestroy = true;

    rayCastTimer = this.game.time.create();
    rayCastTimer.loop(15, this.enableRaycasting, this);
    rayCastTimer.start();

    tutorialTextTimer = this.game.time.create();
    tutorialTextTimer.add(1500, this.showTutorialText, this);
    tutorialTextTimer.start()

    this.moveEnemy();

    //initialise les son et la musique
    music = this.game.add.audio('music');
    music.loop = true;
    music.volume = 1;
    music.play()
    music.fadeIn(2000);

    jumpSound = this.game.add.audio('jump');
    keySound = this.game.add.audio('key');
    deadSound = this.game.add.audio('dead');
    raySound = this.game.add.audio('ray');
    runSound = this.game.add.audio('run');
    doorSound = this.game.add.audio('door');
    alertSound = this.game.add.audio('alert');
    heroLandingSound = this.game.add.audio('landing');
    landingCounter = 0;




    //  les controles du jeu
    cursors = this.game.input.keyboard.createCursorKeys();

    //ajout des touche WAD en plus des touche curseur
    this.wasd = {
        left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: this.game.input.keyboard.addKey(Phaser.Keyboard.D)
    };

    heroLanding = false;

    //si le jeu est lancer sur autre chose qu'un ordinateur de table
    if (!this.game.device.desktop) {
        this.addMobileInputs();
    }


}

level.update = function () {

    this.game.physics.arcade.overlap(laser, player, this.collisionHandler, null, this);
    // creation d'une variable qui contien false mais qui devien true lors de la collision entre le joueur et les plateforme
    hitPlatform = this.game.physics.arcade.collide(player, collisionLayer);
    hitParticles = this.game.physics.arcade.collide(emitter, collisionLayer);

    this.lineOfSight();
    this.movePlayer();

    if (hasFired == true) {
        laser.rotation = this.game.physics.arcade.moveToXY(laser, player.x, player.y, 60, 150);
    } else {
        laser.x = enemy.x;
        laser.y = enemy.y;
    }

    key.animations.play('keyAnim');
    this.game.physics.arcade.overlap(player, key, this.takeKey, null, this);

    //si le joueur touche au rectacle exitRect, demarre le prochain niveau
    if (gotKey == true) {
        this.exitRect.x = exit.x;

        var removeDoor = this.game.add.tween(door).to({
            alpha: 0
        }, 1000, "Sine.easeInOut", true, 0);

        //this.exitRect.y = exit.y;
    } else {
        this.exitRect.x = -40;
    }
    if (Phaser.Rectangle.containsPoint(this.exitRect, player.position)) {
        gotKey = false;
        doorSound.play();
        music.fadeOut(1000);
        var disappear = this.game.add.tween(player).to({
            alpha: 0
        }, 1000, "Sine.easeInOut", true, 0);
        disappear.onComplete.add(this.changeLevel, this);


    }
    //si le joueur n'est plus dans le monde de jeu, affiche l'écran game Over
    if (!player.inWorld) {
        this.gameOver();
    }

}


level.changeLevel = function () {

    this.game.global.levelID = currentLevel + 1;


    if (currentLevel == 3) {
        this.game.state.start("mainMenu")
    } else {
        this.game.state.start("level");
    }
}

level.showTutorialText = function () {
    helpText = this.game.add.text(160, 40, levelText, {
        font: '11px pixelSmall',
        fill: '#0000',
        align: 'left'
    });

    helpText.anchor.set(0.5);
    helpText.alpha = 0;
    showHelpTextTween = this.game.add.tween(helpText)
        .to({
            alpha: 1
        }, 3000, "Sine.easeInOut")
        .to({
            alpha: 0
        }, 3000, "Sine.easeInOut", 3000, true);

    showHelpTextTween.start();


}
level.toggleRays = function() {
    // Toggle the visibility of the rays when the pointer is clicked
    if (this.rayBitmapImage.visible) {
        this.rayBitmapImage.visible = false;
    } else {
        this.rayBitmapImage.visible = true;
    }
};


//fonction qui s'occupe de l'animation du joueur
level.movePlayer = function () {
    //reconfigure la velocité du joueur a chaque itération de la function update(60fps)
    player.body.velocity.x = 0;


    //si la vitesse de chute depasse 200, active le heroLanding
    if (player.body.velocity.y >= 200) {
        heroLanding = true;
    }

    //si le corps du joueur touche au tuile et que l'on pese sur le touche de saut, démarre le processus de saut.
    if (player.body.onFloor()) {
        jumpkey.onDown.add(this.jumpCheck, this);
        altJumpKey.onDown.add(this.jumpCheck, this);
        spaceJumpKey.onDown.add(this.jumpCheck, this);
    }

    //bouge le joueur a gauche et l'anime
    if (cursors.left.isDown || this.moveLeft || this.wasd.left.isDown) {
        if (player.body.onFloor()) {
            runSound.play(null, null, 1, false, false);
        }
        player.scale.x = -playerScale;
        player.body.velocity.x = -80;
        player.animations.play('right');
        if (!hitPlatform) {
            player.frame = 3;
        };
        //bouge le joueur a droite et l'anime
    } else if (cursors.right.isDown || this.moveRight || this.wasd.right.isDown) {
        if (player.body.onFloor()) {
            runSound.play(null, null, 1, false, false);
        }
        player.scale.x = playerScale;
        player.body.velocity.x = 80;
        player.animations.play('left');
        if (!hitPlatform) {
            player.frame = 3;
        };
        //si le heroLanding est activé et que le joueur touche au sol, débloque une animation additonelle
    } else if (heroLanding == true && player.body.onFloor()) {

        player.frame = 4;
        if (landingCounter < 2) {
            heroLandingSound.play(null, null, 3, false, false);
            landingCounter++;
        }

        this.game.time.events.add(Phaser.Timer.SECOND * 0.6, function () {
            heroLanding = false;
            landingCounter = 0;
        });

        //si aucun bouton n'est pressé le joueur est debout face camera  
    } else {
        //  Stand still
        player.animations.stop();
        player.frame = 2;
    }

    //si le joueur touche au sol, reinitialise le compteur de saut a 0
    if (player.body.onFloor()) {
        jumpCount = 0;
    }
}
//fonction qui s'occuppe de l'animation de l'ennemi
level.moveEnemy = function () {

    enemyTween = this.game.add.tween(enemy).to({
            x: this.enemyStop1Rect.x,
            y: this.enemyStop1Rect.y
        }, 3000, "Sine.easeInOut")
        .to({
            x: this.enemyEndRect.x,
            y: this.enemyEndRect.y
        }, 3000, "Sine.easeInOut")
        .to({
            x: this.enemyStop1Rect.x,
            y: this.enemyStop1Rect.y
        }, 3000, "Sine.easeInOut")
        .to({
            x: this.enemyBeginRect.x,
            y: this.enemyBeginRect.y
        }, 3000, "Sine.easeInOut").loop(true);


    enemyTween.start();
}
level.takeKey = function (player, key) {

        //joue le son
        keySound.play();

        // redimensionne la key pour la rendre invisible
        key.scale.setTo(0, 0);


        if (player.scale.x == -1) {
            this.game.add.tween(player.scale).to({
                x: -1.3,
                y: 1.3
            }, 100).yoyo(true).start();

        } else {
            this.game.add.tween(player.scale).to({
                x: 1.3,
                y: 1.3
            }, 100).yoyo(true).start();
        }


        //tue le coin et le fait disparaitre du jeu
        key.kill();

        //joue le son
        //this.coinSound.play();

        //augmente notre score de 5 points
        gotKey = true;

    },


    // fonction qui s'occupe de créé un ligne qui vérifie si l'ennemie percois le joueur
    level.lineOfSight = function () {
        var ray = new Phaser.Line(enemy.x, enemy.y, player.x, player.y);
        // Vérifie si un mur bloque la vision entre l'ennemi et le joueur
        var intersect = this.getWallIntersection(ray);
        if (intersect) {
            // un mur bloque la vision de l'ennmi donc l'ennmi affiche une couleur par defaut
            enemy.tint = 0xffffff;

            if (enemyTween._codePaused == true) {
                restartTweenTimer.start();
            }
            playerVisible = false;
            deathTimer.stop(false);
        } else {
            // l'ennemi peut voir le joueur donc sa couleur change

            enemy.tint = 0xffaaaa;
            enemyTween.pause();
            playerVisible = true;


            if (hasFired == false) {
                deathTimer.start();

                hourGlassVariable++;
                if (hourGlassVariable == 1) {
                    alertSound.play();
                    this.game.camera.flash(0xff0000, 300);
                }
            }

        }
        this.bitmap.dirty = true;
    }

level.restartEnemyMovement = function () {
    enemyTween.resume();
    if (playerVisible == true && hasFired == true) {
        hasFired = true;
    } else {
        hasFired = false;
        hourGlassVariable = 0;
    }
}

level.fireDeathRay = function () {
    raySound.play();
    deathTimer.stop(false);
    laser.visible = true;
    hasFired = true;
    music.fadeOut(1000);

}

//fonction qui active le affichage des rayon de lumiere
level.enableRaycasting = function () {


    // Next, fill the entire light bitmap with a dark shadow color.
    // remplis le bitmap de lumiere creer plus tot avec une couleur sombre
    this.bitmap.context.fillStyle = 'rgb(100, 100, 100)';
    this.bitmap.context.fillRect(0, 0, map.widthInPixels, map.heightInPixels);

    // un tableau qui contient les 4 coin du jeu
    var stageCorners = [
        new Phaser.Point(0, 0),
        new Phaser.Point(map.widthInPixels, 0),
        new Phaser.Point(map.widthInPixels, map.heightInPixels),
        new Phaser.Point(0, map.heightInPixels)
    ];


    // Ray casting!
    // trace des rayon vers chaque coin de chaque mur 
    // sauvegarde tout les point qui interagisse avec un mur qui a la propriété de collision
    var points = [];
    var ray = null;
    var intersect;
    var i;
    var corners;
    collisionChildData.forEach(function (collisionChildData) {
        // creation d'un rayon a partir de l'enemie au travers de chanque coin de la scene
        // ce tableau definis les points ce trouvant a l'interieur de chaque coin pour avoir une surface de contact plus sur
        // cela defini aussi les points a l'exterieur des coin, de cette facon l'ombre contourne les coins
        var corners = [
            new Phaser.Point(collisionChildData.x + 0.1, collisionChildData.y + 0.1),
            new Phaser.Point(collisionChildData.x - 0.1, collisionChildData.y - 0.1),

            new Phaser.Point(collisionChildData.x - 0.1 + collisionChildData.width, collisionChildData.y + 0.1),
            new Phaser.Point(collisionChildData.x + 0.1 + collisionChildData.width, collisionChildData.y - 0.1),

            new Phaser.Point(collisionChildData.x - 0.1 + collisionChildData.width, collisionChildData.y - 0.1 + collisionChildData.height),
            new Phaser.Point(collisionChildData.x + 0.1 + collisionChildData.width, collisionChildData.y + 0.1 + collisionChildData.height),

            new Phaser.Point(collisionChildData.x + 0.1, collisionChildData.y - 0.1 + collisionChildData.height),
            new Phaser.Point(collisionChildData.x - 0.1, collisionChildData.y + 0.1 + collisionChildData.height)
        ];

        // calculation des rayon vers chaque point generer dans la scene
        for (i = 0; i < corners.length; i++) {
            var c = corners[i];

            // un peu d'algebre linéaire ( je ne suis pas l'auteur de se code)
            // ce code genere les ligne pour le debug ( voir les ligne de lumiere)
            // The equation for a line is y = slope * x + b
            // b is where the line crosses the left edge of the stage
            var slope = (c.y - enemy.y) / (c.x - enemy.x);
            var b = enemy.y - slope * enemy.x;

            var end = null;

            if (c.x === enemy.x) {
                // Vertical lines are a special case
                if (c.y <= enemy.y) {
                    end = new Phaser.Point(enemy.x, 0);
                } else {
                    end = new Phaser.Point(enemy.x, map.heightInPixels);
                }
            } else if (c.y === enemy.y) {
                // Horizontal lines are a special case
                if (c.x <= enemy.x) {
                    end = new Phaser.Point(0, enemy.y);
                } else {
                    end = new Phaser.Point(map.widthInPixels, enemy.y);
                }
            } else {
                // Find the point where the line crosses the stage edge
                var left = new Phaser.Point(0, b);
                var right = new Phaser.Point(map.widthInPixels, slope * map.widthInPixels + b);
                var top = new Phaser.Point(-b / slope, 0);
                var bottom = new Phaser.Point((map.heightInPixels - b) / slope, map.heightInPixels);

                // Get the actual intersection point
                if (c.y <= enemy.y && c.x >= enemy.x) {
                    if (top.x >= 0 && top.x <= map.widthInPixels) {
                        end = top;
                    } else {
                        end = right;
                    }
                } else if (c.y <= enemy.y && c.x <= enemy.x) {
                    if (top.x >= 0 && top.x <= map.widthInPixels) {
                        end = top;
                    } else {
                        end = left;
                    }
                } else if (c.y >= enemy.y && c.x >= enemy.x) {
                    if (bottom.x >= 0 && bottom.x <= map.widthInPixels) {
                        end = bottom;
                    } else {
                        end = right;
                    }
                } else if (c.y >= enemy.y && c.x <= enemy.x) {
                    if (bottom.x >= 0 && bottom.x <= map.widthInPixels) {
                        end = bottom;
                    } else {
                        end = left;
                    }
                }
            }

            // Creation d'un rayon
            ray = new Phaser.Line(enemy.x, enemy.y, end.x, end.y);
            // cérifie si le rayon touche a un mur
            intersect = this.getWallIntersection(ray);
            if (intersect) {
                // si oui, le point de contact est ajouté au tableau des point
                points.push(intersect);

            } else {
                // Nothing blocked the ray
                points.push(ray.end);
            }

        }
    }, this);

    // verifie si le coin de la scene est dans l'ombre
    // ceci doit etre fait pour s'assurer que la lumiere ne coupe pas les coins
    for (i = 0; i < stageCorners.length; i++) {
        ray = new Phaser.Line(enemy.x, enemy.y,
            stageCorners[i].x, stageCorners[i].y);
        intersect = this.getWallIntersection(ray);
        if (!intersect) {
            // Corner is in light
            points.push(stageCorners[i]);
        }
    }

    // Now sort the points clockwise around the light
    // Sorting is required so that the points are connected in the right order.
    //
    // This sorting algorithm was copied from Stack Overflow:
    // http://stackoverflow.com/questions/6989100/sort-points-in-clockwise-order
    //
    // Here's a pseudo-code implementation if you want to code it yourself:
    // http://en.wikipedia.org/wiki/Graham_scan
    var center = {
        x: enemy.x,
        y: enemy.y
    };
    points = points.sort(function (a, b) {
        if (a.x - center.x >= 0 && b.x - center.x < 0)
            return 1;
        if (a.x - center.x < 0 && b.x - center.x >= 0)
            return -1;
        if (a.x - center.x === 0 && b.x - center.x === 0) {
            if (a.y - center.y >= 0 || b.y - center.y >= 0)
                return 1;
            return -1;
        }

        // Compute the cross product of vectors (center -> a) x (center -> b)
        var det = (a.x - center.x) * (b.y - center.y) - (b.x - center.x) * (a.y - center.y);
        if (det < 0)
            return 1;
        if (det > 0)
            return -1;

        // Points a and b are on the same line from the center
        // Check which point is closer to the center
        var d1 = (a.x - center.x) * (a.x - center.x) + (a.y - center.y) * (a.y - center.y);
        var d2 = (b.x - center.x) * (b.x - center.x) + (b.y - center.y) * (b.y - center.y);
        return 1;
    });


    // connection des point a l'enemie et remplis les forme en cone de lumiere
    // lorsque ces cone sont multiplier avec le background, la couleur blanche
    // va permettre a la couleur du background de s'afficher comme si elle étais éclairée
    this.bitmap.context.beginPath();
    this.bitmap.context.fillStyle = 'rgb(255, 255, 255)';
    this.bitmap.context.moveTo(points[0].x, points[0].y);
    for (var j = 0; j < points.length; j++) {
        this.bitmap.context.lineTo(points[j].x, points[j].y);
    }
    this.bitmap.context.closePath();
    this.bitmap.context.fill();

    // dessine chacun des rayon dans le rayBitmap
    this.rayBitmap.context.clearRect(0, 0, map.widthInPixels, map.heightInPixels);
    this.rayBitmap.context.beginPath();
    this.rayBitmap.context.strokeStyle = 'rgb(255, 255, 255)';
    this.rayBitmap.context.fillStyle = 'rgb(255, 255, 255)';
    this.rayBitmap.context.moveTo(points[0].x, points[0].y);
    for (var k = 0; k < points.length; k++) {
        this.rayBitmap.context.moveTo(enemy.x, enemy.y);
        this.rayBitmap.context.lineTo(points[k].x, points[k].y);
        this.rayBitmap.context.fillRect(points[k].x - 2, points[k].y - 2, 4, 4);
    }
    this.rayBitmap.context.stroke();

    // indique a phaser de mettre a jour la cache du bitmap
    this.bitmap.dirty = true;
    this.rayBitmap.dirty = true;

    raycasting = false;

}


// cette fonction itere dans tout les murs et retourn l'intersection la plus proche du point de depart du rayon
level.getWallIntersection = function (ray) {
    var distanceToWall = Number.POSITIVE_INFINITY;
    var closestIntersection = null;

    // pour chacun des murs
    collisionChildData.forEach(function (collisionChildData) {
        // 
        // cree un tableau de ligne qui représente les quatre coin de ce mur
        var lines = [
            new Phaser.Line(collisionChildData.x, collisionChildData.y, collisionChildData.x + collisionChildData.width, collisionChildData.y),
            new Phaser.Line(collisionChildData.x, collisionChildData.y, collisionChildData.x, collisionChildData.y + collisionChildData.height),
            new Phaser.Line(collisionChildData.x + collisionChildData.width, collisionChildData.y,
                collisionChildData.x + collisionChildData.width, collisionChildData.y + collisionChildData.height),
            new Phaser.Line(collisionChildData.x, collisionChildData.y + collisionChildData.height,
                collisionChildData.x + collisionChildData.width, collisionChildData.y + collisionChildData.height)
        ];
        // Teste chacun des coté du mur contre le rayon
        // Si le rayon entre en contact avec les coin alors le mur est dans le chemin de la lumiere
        for (var i = 0; i < lines.length; i++) {
            var intersect = Phaser.Line.intersects(ray, lines[i]);
            if (intersect) {
                // cherche l'intersection la plus proche
                distance =
                    this.game.math.distance(ray.start.x, ray.start.y, intersect.x, intersect.y);
                if (distance < distanceToWall) {
                    distanceToWall = distance;
                    closestIntersection = intersect;
                }
            }
        }
    }, this);

    return closestIntersection;
};

level.collisionHandler = function () {
    player.kill();
    deadSound.play();
    laser.visible = false;

    //  Position the emitter where the mouse/touch event was
    emitter.x = player.x;
    emitter.y = player.y;

    //  The first parameter sets the effect to "explode" which means all particles are emitted at once
    //  The second gives each particle a 2000ms lifespan
    //  The third is ignored when using burst/explode mode
    //  The final parameter (10) is how many particles will be emitted in this single burst

    emitter.start(true, 2500, null, 50);

    gameOverTimer = this.game.time.create();
    gameOverTimer.add(2500, this.gameOver, this);
    gameOverTimer.start();


}

//fonction qui effectue le saut du joueur
level.jump = function () {
    jumpSound.play(null, null, 0.2);
    player.body.velocity.y = -150;
    jumpCount++;
}

//fonction qui a pour but de vérifier le nombre de saut restant avant de pouvoir retoucher au sol
level.jumpCheck = function () {
    if (jumpCount == 0 && !player.body.onFloor()) {
        return;
    } else if (jumpCount < 2) {
        this.jump();
    }
}


//fonction qui change la direction du sprite du joueur dans le but de sauvé de l'espace
level.flipPlayer = function () {
    player.scale.x *= -1;
}

level.addMobileInputs = function () {
    //ajoute le bouton pour sauter
    var jumpButton = this.game.add.sprite(this.game.width - 50, this.game.height - 50, 'jumpButton');
    jumpButton.inputEnabled = true;
    jumpButton.alpha = 0.5;
    jumpButton.scale.setTo(0.5);
    //appelle la fonction jumpPlayer quand le bouton pour saute est utiliser
    jumpButton.events.onInputDown.add(this.jumpCheck, this);

    //les variables de mouvement
    this.moveLeft = false;
    this.moveRight = false;

    //ajoute le bouton pour allez a gauche
    var leftButton = this.game.add.sprite(20, this.game.height - 50, 'leftButton');
    leftButton.scale.setTo(0.5);
    leftButton.inputEnabled = true;
    leftButton.alpha = 0.5;
    leftButton.events.onInputOver.add(this.setLeftTrue, this);
    leftButton.events.onInputOut.add(this.setLeftFalse, this);
    leftButton.events.onInputDown.add(this.setLeftTrue, this);
    leftButton.events.onInputUp.add(this.setLeftFalse, this);

    //ajoute le boutron pour allez a droite
    var rightButton = this.game.add.sprite(80, this.game.height - 50, 'rightButton');
    rightButton.inputEnabled = true;
    rightButton.scale.setTo(0.5);
    rightButton.alpha = 0.5;
    rightButton.events.onInputOver.add(this.setRightTrue, this);
    rightButton.events.onInputOut.add(this.setRightFalse, this);
    rightButton.events.onInputDown.add(this.setRightTrue, this);
    rightButton.events.onInputUp.add(this.setRightFalse, this);
}
//Basic functions that are used in our callbacks

level.setLeftTrue = function () {
    this.moveLeft = true;
}

level.setLeftFalse = function () {
    this.moveLeft = false;
}
level.setRightTrue = function () {
    this.moveRight = true;
}
level.setRightFalse = function () {
    this.moveRight = false;
}



//redemarre le jeu
level.gameOver = function () {

    music.stop();
    this.game.state.start("gameOver");
}

level.render = function () {

}

module.exports = level;