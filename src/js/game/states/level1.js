var level1 = {};
var map, collisionLayer, player, cursors,laser, light, jumpCount, jumpkey, theGame, playerScale, heroLanding, raycasting, hitPlatform, enemyTween, hasFired, playerVisible, lightBitmap;
var ray;
var tileHits = [];
level1.create = function () {
    //configure la tilemap
    map = this.game.add.tilemap('niveau1');
    map.addTilesetImage('pixel', 'pixel');
    backgroundLayer = map.createLayer('background');
    falseCollisionLayer = map.createLayer('platform');
    collisionLayer = map.createLayer('platform');
    interactiveLayer = map.createLayer('interactive');

    // extraction des objet interactifs qui se trouve dans le tile map
    begin = map.objects.evenement.find(o => o.name == 'begin')
    this.beginRect = new Phaser.Rectangle(begin.x, begin.y, begin.width, begin.height);

    exit = map.objects.evenement.find(o => o.name == 'exit');
    this.exitRect = new Phaser.Rectangle(exit.x, exit.y, exit.width, exit.height);

    enemyBegin = map.objects.evenement.find(o => o.name == 'enemyBegin');
    this.enemyBeginRect = new Phaser.Rectangle(enemyBegin.x, enemyBegin.y, enemyBegin.width, enemyBegin.height);

    enemyStop1 = map.objects.evenement.find(o => o.name == 'enemyStop1');
    this.enemyStop1Rect = new Phaser.Rectangle(enemyStop1.x, enemyStop1.y, enemyStop1.width, enemyStop1.height);

    enemyEnd = map.objects.evenement.find(o => o.name == 'enemyEnd');
    this.enemyEndRect = new Phaser.Rectangle(enemyEnd.x, enemyEnd.y, enemyEnd.width, enemyEnd.height);

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
    player.scale.setTo(1, 1);
    playerScale = player.scale.x;

    // creation d'une texture bitmap qui va dessiné les cones ''lumiere''
    this.bitmap = this.game.add.bitmapData(this.game.width, this.game.height);
    this.bitmap.context.fillStyle = 'rgb(255, 255, 255)';
    this.bitmap.context.strokeStyle = 'rgb(255, 255, 255)';
    lightBitmap = this.game.add.image(0, 0, this.bitmap);
    lightBitmap.blendMode = Phaser.blendModes.MULTIPLY;

    // cration d'un bitmap pour dessiné les ''rayon''
    this.rayBitmap = this.game.add.bitmapData(this.game.width, this.game.height);
    this.rayBitmapImage = this.game.add.image(0, 0, this.rayBitmap);
    this.rayBitmapImage.visible = false;

    // Function de débug pour afficher ou non les rayon de lumiere
    this.game.input.onTap.add(this.toggleRays, this);

    collisionLayer.visible = false;
    collisionLayer.debug = false;

    //ajoute les collision par exclusion de du calque de collision 
    map.setCollisionByExclusion([], true, collisionLayer);
    collisionLayer.resizeWorld();
    collisionLayer.collideWorldBounds = false;
    backgroundLayer.resizeWorld();


    collisionData = collisionLayer.layer.data;
    collisionChildData = [];


    for (i = 0; i < collisionData.length; i++) {
        for (z = 0; z < collisionData[i].length; z++) {
            if (collisionData[i][z].canCollide) {
                collisionChildData.push(collisionData[i][z]);
            }
        }
    }

    //Configure le compteur de saut pour créé un doule saut
    jumpCount = 0;
    jumpkey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    //configure le comportement de la camera
    this.game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);

    hasFired = false;
    //charge les sprite de l'ennemi
    enemy = this.game.add.sprite(enemyBegin.x, enemyBegin.y, 'enemy');
    enemy.anchor.setTo(0.5, 0.5);

    laser = this.game.add.sprite(enemy.x,enemy.y, 'laser');
    laser.angle=90;
    

    //  Create our Timer
    deathTimer = this.game.time.create(false);
    deathTimer.loop(4000, this.fireDeathRay, this).autoDestroy=true;

    //
    restartTweenTimer = this.game.time.create(false);
    restartTweenTimer.loop(2000, this.restartEnemyMovement,this).autoDestroy=true;
    

    this.moveEnemy();

    foregroundLayer = map.createLayer('foreground');

    //  les controles du jeu
    cursors = this.game.input.keyboard.createCursorKeys();

    heroLanding = false;

}

level1.update = function () {

    // creation d'une variable qui contien false mais qui devien true lors de la collision entre le joueur et les plateforme
    hitPlatform = this.game.physics.arcade.collide(player, collisionLayer);

    this.enableRaycasting();
    this.lineOfSight();
    this.movePlayer();

    //si le joueur touche au rectacle exitRect, demarre le prochain niveau
    if (Phaser.Rectangle.containsPoint(this.exitRect, player.position)) {
        this.resetPlayer();
    }
    //si le joueur n'est plus dans le monde de jeu, affiche l'écran game Over
    if (!player.inWorld) {
        this.resetPlayer();
    }
    console.log(enemy)
    laser.x = enemy.x+enemy.width/2//-enemy.width/2;
    laser.y = enemy.y-enemy.height/2//-enemy.height/2;

}

//fonction qui s'occupe de l'animation du joueur
level1.movePlayer = function () {
    //reconfigure la velocité du joueur a chaque itération de la function update(60fps)
    player.body.velocity.x = 0;

    //si la vitesse de chute depasse 200, active le heroLanding
    if (player.body.velocity.y >= 200) {
        heroLanding = true;
    }

    //si le corps du joueur touche au tuile et que l'on pese sur le touche de saut, démarre le processus de saut.
    if (player.body.onFloor()) {
        jumpkey.onDown.add(this.jumpCheck, this);
    }

    //bouge le joueur a gauche et l'anime
    if (cursors.left.isDown) {
        player.scale.x = -playerScale;
        player.body.velocity.x = -80;
        player.animations.play('right');
        if (!hitPlatform) {
            player.frame = 3;
        };
        //bouge le joueur a droite et l'anime
    } else if (cursors.right.isDown) {

        player.scale.x = playerScale;
        player.body.velocity.x = 80;
        player.animations.play('left');
        if (!hitPlatform) {
            player.frame = 3;
        };
        //si le heroLanding est activé et que le joueur touche au sol, débloque une animation additonelle
    } else if (heroLanding == true && player.body.onFloor()) {
        player.frame = 4;
        this.game.time.events.add(Phaser.Timer.SECOND * 0.6, function () {
            heroLanding = false;
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
level1.moveEnemy = function () {

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

// fonction qui s'occupe de créé un ligne qui vérifie si l'ennemie percois le joueur
level1.lineOfSight = function () {
   console.log(hasFired);
    var ray = new Phaser.Line(enemy.x, enemy.y, player.x, player.y);
    // Vérifie si un mur bloque la vision entre l'ennemi et le joueur
    var intersect = this.getWallIntersection(ray);
    if (intersect) {
        // un mur bloque la vision de l'ennmi donc l'ennmi affiche une couleur par defaut
        enemy.tint = 0xffffff;
        if(enemyTween._codePaused == true){     
            restartTweenTimer.start();
        }   
        playerVisible = false;
        deathTimer.stop(false);
    } else {
        // l'ennemi peut voir le joueur donc sa couleur change

        enemy.tint = 0xffaaaa;
        //this.game.camera.flash(0xff0000, 15500);
        enemyTween.pause();
        playerVisible = true;

        
        if(hasFired==false){
            deathTimer.start();
        }

    }
    this.bitmap.dirty = true;
}

level1.restartEnemyMovement = function() {
    enemyTween.resume();
    if(playerVisible == true && hasFired==true){
        hasFired=true;
    }else {
        hasFired = false;
    }
}

level1.fireDeathRay = function () {
    console.log('boom');
    deathTimer.stop(false);
    hasFired=true;
}

//fonction qui active le affichage des rayon de lumiere
level1.enableRaycasting = function () {


    // Next, fill the entire light bitmap with a dark shadow color.
    // remplis le bitmap de lumiere creer plus tot avec une couleur sombre
    this.bitmap.context.fillStyle = 'rgb(100, 100, 100)';
    this.bitmap.context.fillRect(0, 0, this.game.width, this.game.height);

    // un tableau qui contient les 4 coin du jeu
    var stageCorners = [
        new Phaser.Point(0, 0),
        new Phaser.Point(this.game.width, 0),
        new Phaser.Point(this.game.width, this.game.height),
        new Phaser.Point(0, this.game.height)
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
            new Phaser.Point(collisionChildData.worldX + 0.1, collisionChildData.worldY + 0.1),
            new Phaser.Point(collisionChildData.worldX - 0.1, collisionChildData.worldY - 0.1),

            new Phaser.Point(collisionChildData.worldX - 0.1 + collisionChildData.width, collisionChildData.worldY + 0.1),
            new Phaser.Point(collisionChildData.worldX + 0.1 + collisionChildData.width, collisionChildData.worldY - 0.1),

            new Phaser.Point(collisionChildData.worldX - 0.1 + collisionChildData.width, collisionChildData.worldY - 0.1 + collisionChildData.height),
            new Phaser.Point(collisionChildData.worldX + 0.1 + collisionChildData.width, collisionChildData.worldY + 0.1 + collisionChildData.height),

            new Phaser.Point(collisionChildData.worldX + 0.1, collisionChildData.worldY - 0.1 + collisionChildData.height),
            new Phaser.Point(collisionChildData.worldX - 0.1, collisionChildData.worldY + 0.1 + collisionChildData.height)
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
                    end = new Phaser.Point(enemy.x, this.game.height);
                }
            } else if (c.y === enemy.y) {
                // Horizontal lines are a special case
                if (c.x <= enemy.x) {
                    end = new Phaser.Point(0, enemy.y);
                } else {
                    end = new Phaser.Point(this.game.width, enemy.y);
                }
            } else {
                // Find the point where the line crosses the stage edge
                var left = new Phaser.Point(0, b);
                var right = new Phaser.Point(this.game.width, slope * this.game.width + b);
                var top = new Phaser.Point(-b / slope, 0);
                var bottom = new Phaser.Point((this.game.height - b) / slope, this.game.height);

                // Get the actual intersection point
                if (c.y <= enemy.y && c.x >= enemy.x) {
                    if (top.x >= 0 && top.x <= this.game.width) {
                        end = top;
                    } else {
                        end = right;
                    }
                } else if (c.y <= enemy.y && c.x <= enemy.x) {
                    if (top.x >= 0 && top.x <= this.game.width) {
                        end = top;
                    } else {
                        end = left;
                    }
                } else if (c.y >= enemy.y && c.x >= enemy.x) {
                    if (bottom.x >= 0 && bottom.x <= this.game.width) {
                        end = bottom;
                    } else {
                        end = right;
                    }
                } else if (c.y >= enemy.y && c.x <= enemy.x) {
                    if (bottom.x >= 0 && bottom.x <= this.game.width) {
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
    this.rayBitmap.context.clearRect(0, 0, this.game.width, this.game.height);
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

level1.toggleRays = function () {
    // active ou non la visibilité des rayon au click de la souris
    if (this.rayBitmapImage.visible) {
        this.rayBitmapImage.visible = false;
    } else {
        this.rayBitmapImage.visible = true;
    }
};

// cette fonction itere dans tout les murs et retourn l'intersection la plus proche du point de depart du rayon
level1.getWallIntersection = function (ray) {
    var distanceToWall = Number.POSITIVE_INFINITY;
    var closestIntersection = null;

    // pour chacun des murs
    collisionChildData.forEach(function (collisionChildData) {
        // 
        // cree un tableau de ligne qui représente les quatre coin de ce mur
        var lines = [
            new Phaser.Line(collisionChildData.worldX, collisionChildData.worldY, collisionChildData.worldX + collisionChildData.width, collisionChildData.worldY),
            new Phaser.Line(collisionChildData.worldX, collisionChildData.worldY, collisionChildData.worldX, collisionChildData.worldY + collisionChildData.height),
            new Phaser.Line(collisionChildData.worldX + collisionChildData.width, collisionChildData.worldY,
                collisionChildData.worldX + collisionChildData.width, collisionChildData.worldY + collisionChildData.height),
            new Phaser.Line(collisionChildData.worldX, collisionChildData.worldY + collisionChildData.height,
                collisionChildData.worldX + collisionChildData.width, collisionChildData.worldY + collisionChildData.height)
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


//fonction qui effectue le saut du joueur
level1.jump = function () {
    player.body.velocity.y = -150;
    jumpCount++;
}

//fonction qui a pour but de vérifier le nombre de saut restant avant de pouvoir retoucher au sol
level1.jumpCheck = function () {
    if (jumpCount == 0 && !player.body.onFloor()) {
        return;
    } else if (jumpCount < 2) {
        this.jump();
    }
}


//fonction qui change la direction du sprite du joueur dans le but de sauvé de l'espace
level1.flipPlayer = function () {
    player.scale.x *= -1;
}

//redemarre le jeu
level1.resetPlayer = function () {
    this.game.state.start("preloader");
}


module.exports = level1;