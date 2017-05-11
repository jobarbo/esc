var level1 = {};
var map, collisionLayer, player, cursors,light, jumpCount, jumpkey, theGame, playerScale, heroLanding
var ray; var tileHits = [];
level1.create = function () {

    
    //setup the map
    map = this.game.add.tilemap('niveau1');
    map.addTilesetImage('pixel','pixel');
    backgroundLayer = map.createLayer('background');
    collisionLayer = map.createLayer('platform');
    
    collisionLayer.visible = true;
    collisionLayer.debug = true;

    //setup the collision by exclusion
    map.setCollisionByExclusion([], true, collisionLayer);
    collisionLayer.resizeWorld();
    backgroundLayer.resizeWorld();


    collisionData=collisionLayer.layer.data;
    collisionChildData=[];

    for(i=0;i<collisionData.length;i++){
        for(z=0; z<collisionData[i].length;z++){
            if(collisionData[i][z].canCollide){
                 collisionChildData.push(collisionData[i][z])
            }
        }
    }

    

    //load the base sprite for the player
    player = this.game.add.sprite(32, this.game.world.height - 100, 'player');
    
    //animation du personnage cycle de marche
    player.animations.add('left', [0, 1], 10, true);
    player.animations.add('right', [0, 1], 10, true);
    player.anchor.setTo(0.5, 0.5);

    //this.game.physics.arcade.enable(player);
    this.game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 300;
    player.scale.setTo(1, 1);
    playerScale = player.scale.x;


    //setup the jump count and the jump key
    jumpCount = 0;
    jumpkey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    //setup the camera behavior
    this.game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);

    //load the enemy sprite
    enemy = this.game.add.sprite(32, this.game.world.height - 220, 'enemy');
    enemy.anchor.setTo(0.5,0.5);

    // Create a bitmap texture for drawing light cones
    this.bitmap = this.game.add.bitmapData(this.game.width, this.game.height);
    this.bitmap.context.fillStyle = 'rgb(255, 255, 255)';
    this.bitmap.context.strokeStyle = 'rgb(255, 255, 255)';
    var lightBitmap = this.game.add.image(0, 0, this.bitmap);
    lightBitmap.blendMode = Phaser.blendModes.MULTIPLY;

    // Create a bitmap for drawing rays
    this.rayBitmap = this.game.add.bitmapData(this.game.width, this.game.height);
    this.rayBitmapImage = this.game.add.image(0, 0, this.rayBitmap);
    this.rayBitmapImage.visible = false;

    // Setup function for hiding or showing rays
    this.game.input.onTap.add(this.toggleRays, this);

    // Simulate a pointer click/tap input at the center of the stage
    // when the example begins running.
    this.game.input.activePointer.x = this.game.width/2;
    this.game.input.activePointer.y = this.game.height/2;

    //  Our controls.
    cursors = this.game.input.keyboard.createCursorKeys();

    // pull the exit area from the object layer
    // we will be using this one during update to check if our player has moved into the exit area
    exit = map.objects.evenement.find(o => o.name == 'exit');
    this.exitRect = new Phaser.Rectangle(exit.x, exit.y, exit.width, exit.height);
    
    heroLanding = false;

}

level1.update = function () {

    this.enableRaycasting();

    
    var hitPlatform = this.game.physics.arcade.collide(player, collisionLayer);
    player.body.velocity.x = 0;
     
    if(player.body.velocity.y >= 200){
        heroLanding = true;
    }

    if (player.body.onFloor()){
        jumpkey.onDown.add(this.jumpCheck, this);
    }


    if (cursors.left.isDown) {
        player.scale.x = -playerScale;
        player.body.velocity.x = -50;
        player.animations.play('right');
        if (!hitPlatform) {
            player.frame = 3;
        };

    } else if (cursors.right.isDown) {

        player.scale.x = playerScale;
        player.body.velocity.x =  50;
        player.animations.play('left');
        if (!hitPlatform) {
            player.frame = 3;
        };

    } else if(heroLanding == true && player.body.onFloor()){
        player.frame = 4;
        this.game.time.events.add(Phaser.Timer.SECOND * 0.6, function(){
            heroLanding = false;
        });
        
    } else {
        //  Stand still
        player.animations.stop();
        player.frame = 2;
    }

    
    if (player.body.onFloor()) {
        jumpCount = 0;
    }

    if (Phaser.Rectangle.containsPoint(this.exitRect, player.position)) {
        // and we just reset it to it's starting position
        this.resetPlayer();
    }

    if(!player.inWorld){
        this.resetPlayer();
    }

}

level1.jumpCheck = function ()  { 
    if(jumpCount == 0  && !player.body.onFloor()){
        return;
    }
    else if (jumpCount < 2) {
        this.jump();       
    }
}


level1.jump = function () {
        player.body.velocity.y = -150;
        jumpCount++;
}

level1.flipPlayer = function () {
    player.scale.x *=-1;
}

level1.resetPlayer = function () {;
    this.game.state.start("preloader");
}

level1.enableRaycasting = function() {
    // Move the enemy to the pointer/touch location
    enemy.x = this.game.input.activePointer.x;
    enemy.y = this.game.input.activePointer.y;

    // Next, fill the entire light bitmap with a dark shadow color.
    this.bitmap.context.fillStyle = 'rgb(100, 100, 100)';
    this.bitmap.context.fillRect(0, 0, this.game.width, this.game.height);

    // An array of the stage corners that we'll use later
    var stageCorners = [
        new Phaser.Point(0, 0),
        new Phaser.Point(this.game.width, 0),
        new Phaser.Point(this.game.width, this.game.height),
        new Phaser.Point(0, this.game.height)
    ];


    // Ray casting!
    // Cast rays through the corners of each wall towards the stage edge.
    // Save all of the intersection points or ray end points if there was no intersection.
    var points = [];
    var ray = null;
    var intersect;
    var i;
    collisionChildData.forEach(function(collisionChildData) {
        // Create a ray from the light through each corner out to the edge of the stage.
        // This array defines points just inside of each corner to make sure we hit each one.
        // It also defines points just outside of each corner so we can see to the stage edges.
        var corners = [
            new Phaser.Point(collisionChildData.worldX+0.1, collisionChildData.worldY+0.1),
            new Phaser.Point(collisionChildData.worldX-0.1, collisionChildData.worldY-0.1),

            new Phaser.Point(collisionChildData.worldX-0.1 + collisionChildData.width, collisionChildData.worldY+0.1),
            new Phaser.Point(collisionChildData.worldX+0.1 + collisionChildData.width, collisionChildData.worldY-0.1),

            new Phaser.Point(collisionChildData.worldX-0.1 + collisionChildData.width, collisionChildData.worldY-0.1 + collisionChildData.height),
            new Phaser.Point(collisionChildData.worldX+0.1 + collisionChildData.width, collisionChildData.worldY+0.1 + collisionChildData.height),

            new Phaser.Point(collisionChildData.worldX+0.1, collisionChildData.worldY-0.1 + collisionChildData.height),
            new Phaser.Point(collisionChildData.worldX-0.1, collisionChildData.worldY+0.1 + collisionChildData.height)
        ];
        // Calculate rays through each point to the edge of the stage
        for(i = 0; i < corners.length; i++) {
            var c = corners[i];

            // Here comes the linear algebra.
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
                var top = new Phaser.Point(-b/slope, 0);
                var bottom = new Phaser.Point((this.game.height-b)/slope, this.game.height);

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

            // Create a ray
            ray = new Phaser.Line( enemy.x, enemy.y,end.x, end.y);
            // Check if the ray intersected the wall
            intersect = this.getWallIntersection(ray);
            if (intersect) {
                // This is the front edge of the light blocking object
                points.push(intersect);
               
            } 

        }
    }, this);

    // Shoot rays at each of the stage corners to see if the corner
    // of the stage is in shadow. This needs to be done so that
    // shadows don't cut the corner.
    for(i = 0; i < stageCorners.length; i++) {
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
    var center = { x: enemy.x, y: enemy.y };
    points = points.sort(function(a, b) {
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


    // Connect the dots and fill in the shape, which are cones of light,
    // with a bright white color. When multiplied with the background,
    // the white color will allow the full color of the background to
    // shine through.
    this.bitmap.context.beginPath();
    this.bitmap.context.fillStyle = 'rgb(255, 255, 255)';
    this.bitmap.context.moveTo(points[0].x, points[0].y);
    for(var j = 0; j < points.length; j++) {
        this.bitmap.context.lineTo(points[j].x, points[j].y);
    }
    this.bitmap.context.closePath();
    this.bitmap.context.fill();

    // Draw each of the rays on the rayBitmap
    this.rayBitmap.context.clearRect(0, 0, this.game.width, this.game.height);
    this.rayBitmap.context.beginPath();
    this.rayBitmap.context.strokeStyle = 'rgb(255, 255, 255)';
    this.rayBitmap.context.fillStyle = 'rgb(255, 255, 255)';
    this.rayBitmap.context.moveTo(points[0].x, points[0].y);
    for(var k = 0; k < points.length; k++) {
        this.rayBitmap.context.moveTo(enemy.x, enemy.y);
        this.rayBitmap.context.lineTo(points[k].x, points[k].y);
        this.rayBitmap.context.fillRect(points[k].x-2, points[k].y-2, 4, 4);
    }
    this.rayBitmap.context.stroke();

    // This just tells the engine it should update the texture cache
    this.bitmap.dirty = true;
    this.rayBitmap.dirty = true;



}

level1.toggleRays = function() {
    // Toggle the visibility of the rays when the pointer is clicked
    if (this.rayBitmapImage.visible) {
        this.rayBitmapImage.visible = false;
    } else {
        this.rayBitmapImage.visible = true;
    }
};

// Given a ray, this function iterates through all of the walls and
// returns the closest wall intersection from the start of the ray
// or null if the ray does not intersect any walls.
level1.getWallIntersection = function(ray) {
    var distanceToWall = Number.POSITIVE_INFINITY;
    var closestIntersection = null;

    // For each of the walls...
    collisionChildData.forEach(function(collisionChildData) {
        // Create an array of lines that represent the four edges of each wall
        var lines = [
            new Phaser.Line(collisionChildData.worldX, collisionChildData.worldY, collisionChildData.worldX + collisionChildData.width, collisionChildData.worldY),
            new Phaser.Line(collisionChildData.worldX, collisionChildData.worldY, collisionChildData.worldX, collisionChildData.worldY + collisionChildData.height),
            new Phaser.Line(collisionChildData.worldX + collisionChildData.width, collisionChildData.worldY,
                collisionChildData.worldX + collisionChildData.width, collisionChildData.worldY + collisionChildData.height),
            new Phaser.Line(collisionChildData.worldX, collisionChildData.worldY + collisionChildData.height,
                collisionChildData.worldX + collisionChildData.width, collisionChildData.worldY +collisionChildData.height)
        ];

        // Test each of the edges in this wall against the ray.
        // If the ray intersects any of the edges then the wall must be in the way.
        for(var i = 0; i < lines.length; i++) {
            var intersect = Phaser.Line.intersects(ray, lines[i]);
            if (intersect) {
                // Find the closest intersection
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

module.exports = level1;

