SVG.on(document, 'DOMContentLoaded', function() {

const PIX = 2;
const DIM = 8;
const GRAVITY = 0.12;
const DELAY = 500;


var game,
    physics,
    gravity,
    control,
    sound,
    dude,
    dude2,
    frame1,
    frame2,
    frame3,
    frame4,
    digits,

    screen = SVG('drawing'),
    b = bitmap,

    dude1 = [b[0],  b[1],  b[2],  b[3]],
    dude2 = [b[0],  b[8],  b[2],  b[9]],
    dude3 = [b[0],  b[10], b[2],  b[11]],
    dude4 = [b[14], b[8],  b[2],  b[9]],
    dude5 = [b[39], b[40], b[41], b[42]],


    bal1 = [b[4],  b[5], b[6],  b[7]],
    bal2 = [b[12], b[5], b[13], b[7]],
    bal3 = [b[15], b[16], b[17], b[18]],
    bal4 = [b[19], b[20]];
    bal5 = [b[21], b[22]];

    var palette  = [null, '#f06', '#06f', '#fc9'];
    var palette2 = [null, '#9f9', '#06f', '#fff'];
    var palette3 = [null, '#06f', '#3cf', '#fff'];

    var stage = screen.rect('100%', '60%')
    stage.fill('#000');

    game = new Game(screen);
    game.init({ bounds:{ top: 0, bottom: stage.y() + stage.bbox().height, left: 0, right: stage.x() + stage.bbox().width} })

    game.layers.objects = screen.group();
    game.layers.sprites = screen.group();
    game.layers.foreground = screen.group();

    game.cast.balloons = [];
    game.cast.bolts    = [];
    game.score = 0;

    dude = new Sprite(game, palette, DIM, PIX);

    frame1 = dude.group(dude.draw(dude1, {x:0, y:DIM*2*PIX}), dude.draw(bal1));
    frame2 = dude.group(dude.draw(dude2, {x:0, y:DIM*2*PIX}), dude.draw(bal1));
    frame3 = dude.group(dude.draw(dude3, {x:0, y:DIM*2*PIX}), dude.draw(bal1));
    frame4 = dude.group(dude.draw(dude4, {x:0, y:DIM*2*PIX + 2*PIX}), dude.draw(bal2, { x:0, y: 2*PIX }));

    var player = dude.add(frame1, frame2, frame3, frame4);

    game.layers.sprites.add(player.sprite);

    var balloon = new Sprite(game, palette2, DIM, PIX);
    var balloon_frames = [
        [[bal3, { x:0, y: 0}], [bal4, { x:0, y: DIM*2*PIX }]],
        [[bal3, { x:0, y: 0}], [bal5, { x:0, y: DIM*2*PIX }]],
        [[bal3, { x:0, y: 0}], [bal5, { x:0, y: DIM*2*PIX }]],
        [[bal3, { x:0, y: 0}], [bal4, { x:0, y: DIM*2*PIX }]]
    ];


    var bolt = new Sprite(game, palette, DIM, PIX);
    var bolt_frames = [
        [[ [b[23], b[24], b[25], b[26]], { x:0, y: 0} ]],
        [[[b[27], b[28], b[29], b[30]], { x:0, y: 0}]],
        [[[b[31], b[32], b[33], b[34]], { x:0, y: 0}]],
        [[[b[35], b[36], b[37], b[38]], { x:0, y: 0}]]
    ];

    var water = new Sprite(game, palette3, DIM, PIX);
    // var water_frames = [
    //     [ [[b[43]], { x:0, y:0 }] ]
    // ];
    for(var i=0, l=game.bounds.right; i<l; i+=DIM*PIX){
        var w = water.draw( [b[43], b[44], b[45], b[46]], { x:0, y:0} ).attr('class', 'water');
        game.layers.foreground.add(w.move(i, game.bounds.bottom-DIM*PIX));
    }

    dude.frames[0];
    dude.frames[1].opacity(0);
    dude.frames[2].opacity(0);
    dude.frames[3].opacity(0);

    var dead = dude.draw(dude5, {x:0, y:0});
    dead.opacity(0);
    game.layers.sprites.add(dead);

    var start = {x: stage.x() + stage.bbox().width - player.sprite.bbox().width*3, y:stage.y() + stage.bbox().height/2 - player.sprite.bbox().height };
    player.sprite.move(start.x, start.y);

    physics = new Physics(game);
    gravity = physics.gravity(player.sprite, GRAVITY);
    physics.speedRange(PIX, PIX*3);

    control = new Controller(game);
    control.init();
    // screen.transform({scale:1.2})

    control.set("left",  function(){
        physics.momentum = physics.basespeed;
    });

    control.set("right", function(){
        physics.momentum = physics.basespeed;
    });

    control.set("a",     function(){
        if(!game.started && game.state=="running") game.started = true;
        game.frame = game.frame < 3 ? game.frame + 1 : 0;
        dude.animate(game.frame);
    });

    control.set("pause", function(){
        if(this.game.state!=this.game.states["RUNNING"] && !game.started){
            this.game.start();
        }
        else if(!this.game.PAUSED){
            this.game.pause();
            sound.pause('music');
            sound.play('pause');
        }
        else{
            sound.audio.pause.currTime = 0;
            sound.play('pause');
            setTimeout(sound.play('music'), 500);
            this.game.run();
        }
    })

    game.display('score', 10, 10, {'family':'Press Start 2P', 'fill':'#fff', 'size':12});
    game.textbox.score.text("Score: 0000000000");

    game.start(function(){
        sound = new Sound(game);
        sound.new('music', 'sounds/trip.mp3');
        sound.new('burst', 'sounds/burst.mp3');
        sound.new('pause', 'sounds/pause.mp3');
        sound.new('dead', 'sounds/clear.mp3');
        sound.new('flap', 'sounds/flap.mp3');
        sound.new('fall', 'sounds/fall.mp3');
        game.run();
        sound.play('music');
    });

    function randomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    var generate = function(){
        var b,
        d1 = Math.random(),
        d2 = Math.random(),
        d3 = Math.random(),

        y1 = randomInt(player.sprite.bbox().height, stage.bbox().height - player.sprite.bbox().height*2),
        y2 = randomInt(player.sprite.bbox().height, stage.bbox().height - player.sprite.bbox().height*2);

        if(d1<0.05){
            b = balloon.factory('balloons', balloon_frames);
            game.layers.objects.add(b.sprite.move(stage.x()-game.layers.objects.x(), y1).attr('class', 'balloon'));
        }

        if(d2<0.15){
            var buzz = balloon.factory('bolts', bolt_frames);
            game.layers.objects.add(buzz.sprite.move(stage.x()-game.layers.objects.x()-buzz.sprite.bbox().width*2, y2).attr('class', 'bolt'));
        }

        game.layers.objects.select('.balloon').each(function(c, children){
            var exit = stage.bbox().width - (children[c].x()+game.layers.objects.x()) < 0;
            if(exit){
                for(var i=0, l=game.cast.balloons.length; i<l; i++){
                    if(game.cast.balloons[i]!==undefined && game.cast.balloons[i].sprite===children[c]){
                        delete game.cast.balloons[i]
                    }
                }
                children[c].remove();
            }
        });

        game.layers.objects.select('.bolt').each(function(c, children){
            var exit = stage.bbox().width - (children[c].x()+game.layers.objects.x()) < 0;
            if(exit){
                for(var i=0, l=game.cast.bolts.length; i<l; i++){
                    if(game.cast.bolts[i]!==undefined && game.cast.bolts[i].sprite===children[c]){
                        delete game.cast.bolts[i]
                    }
                }
                children[c].remove();
            }
        });
    };

    var update = function(){
        // console.log(control.direction)
        if( control.pressed("RIGHT") ){
            if(control.direction=="right" && game.counter%100===0)
                physics.accelerate(PIX/2);
        }

        if( control.pressed("LEFT") ){
            if(control.direction=="left" && game.counter%100===0)
                physics.accelerate(PIX/2);
        }

        if( control.pressed("A") ){
            dude.animate(game.frame);
        }

        generate();

        for(var i=0, l=game.cast.bolts.length; i<l; i++){
            if(game.cast.bolts[i]!==undefined){
                    game.cast.bolts[i].animate(game.frame);
            }
        }

        if(game.counter%20===0){
            for(var i=0, l=game.cast.balloons.length; i<l; i++){
                if(game.cast.balloons[i]!==undefined){
                        game.cast.balloons[i].animate(game.frame);
                }
            }
            game.score += 10;
        }

        digits = String(game.score).length;
        digits = 10 - digits;
        game.textbox.score.text('Score: ' + "0".repeat(digits) + game.score);
    };

    var tween = function(){
        if( !physics.vector.bouncing && control.pressed("RIGHT") ){
            control.direction = "right";

            physics.vector.direction = control.pressed("A") ? 'NE' : 'E';

            if(player.sprite.cx()<game.bounds.right && !gravity.grounded){
                player.move(physics.momentum, 0);
            }
            else{
                physics.momentum = 0;
            }
        }
        // else if(!control.pressed("LEFT") && game.counter%40===0){
        //     physics.decelerate(PIX*0.1);
        // }

        if( !physics.vector.bouncing && control.pressed("LEFT") ){
            control.direction = "left";

            physics.vector.direction = control.pressed("A") ? 'NW' : 'W';


            if(player.sprite.cx()>game.bounds.left && !gravity.grounded){
                player.move(-physics.momentum, 0);
            }
            else{
                physics.momentum = 0;
            }
        }
        // else if(!control.pressed("RIGHT") && game.counter%40===0){
        //     physics.decelerate(PIX*0.1);
        // }

        if( !physics.vector.bouncing && control.pressed("A") ){
            if(!control.pressed('RIGHT') && !control.pressed('LEFT')){
                // if(control.direction=="up")
                physics.momentum = 0;
                control.direction = "up";
                physics.vector.direction = 'N';
            }

            if(player.sprite.cy() < game.bounds.top){
                physics.deflect(player.sprite);
            }else{
                // player.move(0, gravity.lift);
                gravity.float(DELAY);
            }
            gravity.grounded = false;
        }
        else{
            if(game.started)
                gravity.update();
            physics.vector.direction = 'S';
        }
        scroll();

        for(var i=0, l=game.cast.balloons.length; i<l; i++){
            if(game.cast.balloons[i]!==undefined){

                if(player.collision(game.cast.balloons[i])){
                    game.cast.balloons[i].sprite.remove();
                    delete game.cast.balloons[i];
                    sound.audio.burst.currentTime = 0;
                    sound.play('burst');
                    game.score += 300;
                    digits = String(game.score).length;
                    digits = 10 - digits;
                    game.textbox.score.text('Score: ' + "0".repeat(digits) + game.score);
                }
            }
        }
        for(var i=0, l=game.cast.bolts.length; i<l; i++){
            if(game.cast.bolts[i]!==undefined){
                if(player.collision(game.cast.bolts[i])){
                    gameover();
                }
            }
        }
    };


    var scroll = function(){
        var items = game.layers.objects.children();
        var foreground = game.layers.foreground.children();

        for(var i=0, l=items.length; i<l; i++){
            items[i].dmove(PIX*0.75);
        }

        // for(var i=0, l=foreground.length; i<l; i++){
        //     var exit = stage.bbox().width - (foreground[i].x()+game.layers.foreground.x()) < 0;
        //     if(exit)
        //         foreground[i].move(0);
        //     else
        //         foreground[i].dmove(PIX*0.75);
        // }

        if(!game.started && player.position().x<game.bounds.right-player.sprite.bbox().width)
            player.move(PIX/2);
        if(player.position().x==game.bounds.right-player.sprite.bbox().width)
            game.started = true;
    };

    var gameover = function(){
        console.log("Game Over");
        game.state = game.states.GAME_OVER;
        sound.stop('music');
        dead.move(player.sprite.x(), player.sprite.y()).opacity(1);
        dead.animate(300).dmove(0, -2*dead.bbox().height);
        setTimeout(function(){dead.animate().dmove(0, game.bounds.bottom-player.sprite.y()+dead.bbox().height)}, 400);
        player.sprite.opacity(0);
        sound.play('fall');
        setTimeout(function(){ sound.stop('fall'); }, 900);
        setTimeout(function(){ sound.play('dead'); }, 1000);
    };

    game.add(update, 'update');
    game.add(tween, 'tween');

    window.game = game;
});