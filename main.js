SVG.on(document, 'DOMContentLoaded', function() {

const PIX = 2;
const DIM = 8;

var game,
    physics,
    gravity,
    control,
    dude,
    dude2,
    frame1,
    frame2,
    frame3,
    frame4,
    screen = SVG('drawing'),
    b = bitmap,

    dude1 = [b[0],  b[1],  b[2], b[3]],
    dude2 = [b[0],  b[8],  b[2], b[9]],
    dude3 = [b[0],  b[10], b[2], b[11]],
    dude4 = [b[14], b[8],  b[2], b[9]],

    bal1 = [b[4],  b[5], b[6],  b[7]],
    bal2 = [b[12], b[5], b[13], b[7]],
    bal3 = [b[15], b[16], b[17], b[18]],
    bal4 = [b[19], b[20]];
    bal5 = [b[21], b[22]];

    var palette  = [null, '#f06', '#06f', '#fc9'];
    var palette2 = [null, '#9f9', '#06f', '#fff'];

    var stage = screen.rect('100%', '60%')
    stage.fill('#000');

    game = new Game(screen);
    game.init({ bounds:{ top: 0, bottom: stage.y() + stage.bbox().height, left: 0, right: stage.x() + stage.bbox().width} })

    game.layers.objects = screen.group();

    dude = new Sprite(game, palette, DIM, PIX);
    // balloon2 = new Sprite(screen, palette2, DIM, PIX);
    //dude2 = new Sprite(screen, palette, DIM, PIX);
    frame1 = dude.group(dude.draw(dude1, {x:0, y:DIM*2*PIX}), dude.draw(bal1));
    frame2 = dude.group(dude.draw(dude2, {x:0, y:DIM*2*PIX}), dude.draw(bal1));
    frame3 = dude.group(dude.draw(dude3, {x:0, y:DIM*2*PIX}), dude.draw(bal1));
    frame4 = dude.group(dude.draw(dude4, {x:0, y:DIM*2*PIX + 2*PIX}), dude.draw(bal2, { x:0, y: 2*PIX }));

    var player = dude.add(frame1, frame2, frame3, frame4);

    console.log(player.frames)

    game.cast.balloons = [];

    var balloon = new Sprite(game, palette2, DIM, PIX);

    // function* frames(){
    //     var i=0, f = [balloon.group(balloon.draw(bal3), balloon.draw(bal4, { x:0, y: DIM*2*PIX })),
    //     balloon.group(balloon.draw(bal3), balloon.draw(bal5, { x:0, y: DIM*2*PIX })),
    //     balloon.group(balloon.draw(bal3), balloon.draw(bal5, { x:0, y: DIM*2*PIX })),
    //     balloon.group(balloon.draw(bal3), balloon.draw(bal4, { x:0, y: DIM*2*PIX }))]
    //     while(true)
    //         yield f[i++];
    // };
    var balloon_frames = [
        [[bal3, { x:0, y: 0}], [bal4, { x:0, y: DIM*2*PIX }]],
        [[bal3, { x:0, y: 0}], [bal5, { x:0, y: DIM*2*PIX }]],
        [[bal3, { x:0, y: 0}], [bal5, { x:0, y: DIM*2*PIX }]],
        [[bal3, { x:0, y: 0}], [bal4, { x:0, y: DIM*2*PIX }]]
    ];


    var factory = function(){
        var bal = new Sprite(game, palette2, DIM, PIX);
            bal.add(
                bal.group(bal.draw(bal3), bal.draw(bal4, { x:0, y: DIM*2*PIX })),
                bal.group(bal.draw(bal3), bal.draw(bal5, { x:0, y: DIM*2*PIX })),
                bal.group(bal.draw(bal3), bal.draw(bal5, { x:0, y: DIM*2*PIX })),
                bal.group(bal.draw(bal3), bal.draw(bal4, { x:0, y: DIM*2*PIX }))
            );
        bal.frames[0];
        bal.frames[1].opacity(0);
        bal.frames[2].opacity(0);
        bal.frames[3].opacity(0);
        return bal;
    };


    // bal.factory('balloon')
    // console.log(bal, bal.clone());
    //     return {
    //         object : bal,
    //         box : balloon
    //     }
    // }

    // balloon.sprite.move(100,100)
    // balloon.sprite.clone().move(100,100)

    // game.layers.objects.add(bal.sprite);

    dude.frames[0];
    dude.frames[1].opacity(0);
    dude.frames[2].opacity(0);
    dude.frames[3].opacity(0);



    var start = {x: stage.x() + stage.bbox().width - player.sprite.bbox().width*3, y:stage.y() + stage.bbox().height/2 - player.sprite.bbox().height };
    player.sprite.move(start.x, start.y);

    physics = new Physics(game);
    gravity = physics.gravity( player.sprite, 0.2);
    physics.speedRange(PIX, PIX*3);

    control = new Controller(game);
    control.init();
    // screen.transform({scale:1.2})

    control.set("left",  function(){
        // console.log("left");
        physics.momentum = physics.basespeed;
    });

    control.set("right", function(){
        // console.log("right");
        physics.momentum = physics.basespeed;
    });

    control.set("a",     function(){
        // console.log("a");
        if(!game.started) game.started = true;
        game.frame = game.frame < 3 ? game.frame + 1 : 0;
        dude.animate(game.frame);
    });

    function randomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    var generate = function(){
        var b;
        var y = randomInt(player.sprite.bbox().height, stage.bbox().height - player.sprite.bbox().height*2);

        if(Math.random()<0.03){
            // b = bal.clone();
            // b = factory();
            b = balloon.factory('balloon', balloon_frames);
            // game.cast.balloons.push(balloon.factory());
            game.layers.objects.add(b.sprite.move(0-game.layers.objects.x(), y).attr('class', 'balloon'));
            game.cast.balloons.push(b);
        }

        game.layers.objects.select('.balloon').each(function(i, children){
            var exit = stage.bbox().width - (children[i].x()+game.layers.objects.x()) < 0;
            if(exit) children[i].remove();
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
        // console.log(game.layers.objects.select('.balloon'))
        game.layers.objects.select('.balloon').each(
            function(i, elem){
                // console.log(elem[i].parent());
                // elem[i].animate(game.frame)
        });
        generate();
        // if(game.counter%20===0)

        for(var i=0, l=game.cast.balloons.length; i<l; i++){
            // console.log(i, game.cast.balloons[i])
            game.cast.balloons[i].animate(game.frame);
        }
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
                player.move(0, gravity.lift);
                gravity.float();
            }
            gravity.grounded = false;
        }
        else{
            if(game.started)
                gravity.update();
            physics.vector.direction = 'S';
        }

        scroll();
    };


    var scroll = function(){
        game.layers.objects.dmove(PIX/2);
        if(!game.started && player.position().x<game.bounds.right-player.sprite.bbox().width)
            player.move(PIX/2);
        if(player.position().x==game.bounds.right-player.sprite.bbox().width)
            game.started = true;
    };

    game.add(update, 'update');
    game.add(tween, 'tween');
    game.run();
    window.game = game;



});