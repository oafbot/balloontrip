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

    d1 = [
            0,0,0,1,1,1,1,0,
            0,0,0,0,0,3,0,0,
            0,0,0,0,0,2,2,2,
            0,0,0,0,2,2,2,2,
            0,0,0,0,2,2,2,2,
            0,0,0,0,3,1,3,2,
            0,0,0,3,3,1,3,1,
            0,0,0,3,3,3,3,1
    ],
    d2 = [
            0,0,3,0,0,0,0,0,
            0,3,0,0,0,0,0,0,
            2,2,0,0,0,0,0,0,
            3,2,2,0,0,3,0,0,
            2,2,2,0,3,3,0,0,
            2,2,2,0,3,3,0,0,
            2,2,2,2,2,3,3,0,
            2,2,1,2,2,0,0,0
    ],
    d3 = [
            0,0,0,0,0,3,3,3,
            0,0,0,0,0,0,1,1,
            0,0,0,0,0,0,0,1,
            0,0,0,0,0,2,0,1,
            0,0,0,0,0,2,2,2,
            0,0,0,0,0,0,2,2,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0
    ],
    d4 = [
            3,1,2,2,0,0,0,0,
            1,2,2,1,0,0,0,0,
            3,1,1,1,0,0,0,0,
            1,1,1,1,0,0,0,0,
            1,1,1,0,0,0,0,0,
            2,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0
    ],
    d5 = [
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,1,1,1,1,0
    ],
    d6 = [
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,1,1,1,1,0,0,0,
            1,1,1,1,1,1,0,0
    ],
    d7 = [
            0,0,1,1,1,1,1,1,
            0,1,1,1,1,1,3,1,
            0,1,1,1,1,1,1,3,
            1,1,1,1,1,1,1,3,
            1,1,1,1,1,1,1,1,
            0,1,1,1,1,1,1,1,
            0,1,1,1,1,1,1,1,
            0,0,1,1,1,1,1,1
    ],
    d8 = [
            2,1,1,1,3,1,1,0,
            1,2,1,1,1,3,1,0,
            1,2,1,1,1,3,1,1,
            1,1,2,1,1,1,1,1,
            1,1,2,1,1,1,1,0,
            1,2,1,1,1,1,1,0,
            1,2,1,1,1,1,0,0,
            0,1,1,1,1,0,0,0
    ],
    d9 = [
            0,0,3,0,0,0,0,0,
            0,3,0,0,0,0,0,0,
            2,2,0,0,0,0,0,0,
            3,2,2,0,0,0,0,0,
            2,2,2,0,0,0,0,0,
            2,2,2,0,0,0,0,0,
            2,2,2,0,0,0,0,0,
            2,2,1,2,2,3,3,0
    ],
    d10 = [
            3,1,2,2,2,3,3,3,
            1,2,2,1,0,3,0,0,
            3,1,1,1,0,0,0,0,
            1,1,1,1,0,0,0,0,
            1,1,1,0,0,0,0,0,
            2,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0
    ],
    d11 = [
            0,0,3,0,0,0,0,0,
            0,3,0,0,0,0,0,0,
            2,2,0,0,0,0,0,0,
            3,2,2,0,0,0,0,0,
            2,2,2,0,0,0,0,0,
            2,2,2,0,0,0,0,0,
            2,2,2,0,0,0,0,0,
            2,2,0,0,0,0,0,0
    ],
    d12 = [
            3,1,1,0,0,0,0,0,
            1,2,2,2,0,0,0,0,
            3,1,2,2,2,0,0,0,
            1,1,1,2,2,0,0,0,
            1,1,1,3,3,3,0,0,
            2,0,0,0,3,3,3,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0
    ],
    d13 = [
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,1,1,1,1,0,
            0,0,1,1,1,1,1,1,
    ],
    d14 = [
            0,1,1,1,1,1,3,1,
            0,1,1,1,1,1,1,3,
            1,1,1,1,1,1,1,3,
            1,1,1,1,1,1,1,1,
            0,1,1,1,1,1,1,1,
            0,1,1,1,1,1,1,1,
            0,0,1,1,1,1,1,1,
            0,0,0,1,1,1,1,1
    ],
    d15 = [
            0,0,0,0,3,0,0,0,
            0,0,0,0,0,3,0,0,
            0,0,0,0,0,2,2,2,
            0,0,0,0,2,2,2,2,
            0,0,0,0,2,2,2,2,
            0,0,0,0,3,1,3,2,
            0,0,0,3,3,1,3,1,
            0,0,0,3,3,3,3,1
    ],

    dude1 = [d1,  d2,  d3, d4 ],
    dude2 = [d1,  d9,  d3, d10],
    dude3 = [d1,  d11, d3, d12],
    dude4 = [d15, d9,  d3, d10],

    bal1 = [d5,  d6, d7,  d8],
    bal2 = [d13, d6, d14, d8],

    palette = [null, '#f06', '#06f', '#fc9'];

    var stage = screen.rect('100%', '60%')
    stage.fill('#000');

    game = new Game();

    game.init({bounds:{ top: 0, bottom: stage.y() + stage.bbox().height, left: 0, right: stage.x() + stage.bbox().width}})


    dude = new Sprite(screen, palette, DIM, PIX);
    //dude2 = new Sprite(screen, palette, DIM, PIX);
    frame1 = dude.draw(dude1, {x:0, y:DIM*2*PIX});
    frame2 = dude.draw(dude2, {x:0, y:DIM*2*PIX});
    frame3 = dude.draw(dude3, {x:0, y:DIM*2*PIX});
    frame4 = dude.draw(dude4, {x:0, y:DIM*2*PIX + 2*PIX});

    var player = dude.add(
        dude.group(frame1, dude.draw(bal1)),
        dude.group(frame2, dude.draw(bal1)),
        dude.group(frame3, dude.draw(bal1)),
        dude.group(frame4, dude.draw(bal2, { x:0, y: 2*PIX }))
    );

    dude.frames[0].move(300,100);
    dude.frames[1].move(300,100).opacity(0);
    dude.frames[2].move(300,100).opacity(0);
    dude.frames[3].move(300,100).opacity(0);

    physics = new Physics(game);
    gravity = physics.gravity( player.sprite, 4, game.bounds.bottom );
    physics.speedRange(PIX, PIX*3);

    control = new Controller(game);
    control.init();
    // screen.transform({scale:1.2})
    // frames.animate(200, '<', 0).move(-100, 0)

    control.set("left",  function(){ console.log("left") });
    control.set("right", function(){ console.log("right") });
    control.set("a",     function(){
        console.log("a");
        game.frame = game.frame < 3 ? game.frame + 1 : 0;
        dude.animate(game.frame);
    });

    var update = function(){
        // console.log(control.direction)
        if( control.pressed("RIGHT") ){
            if(control.direction=="right" && game.counter%40===0)
                physics.accelerate(PIX/2);
        }

        if( control.pressed("LEFT") ){
            if(control.direction=="left" && game.counter%40===0)
                physics.accelerate(PIX/2);
        }

        if( control.pressed("A") ){
            dude.animate(game.frame);

            gravity.float();

            if(!control.pressed('RIGHT') && !control.pressed('LEFT')){
                if(control.direction=="up")
                    physics.momentum = 0;
                control.direction = "up";
            }
        }else{
            gravity.update();
        }
    };

    var tween = function(){
        if( control.pressed("RIGHT") ){
            if(control.direction=="left")
                physics.momentum = physics.basespeed;
            // if(control.direction=="right" && game.counter%40===0)
            //     physics.accelerate(PIX);

            control.direction = "right";

            if(player.sprite.cx()<game.bounds.right && !gravity.grounded){
                player.move(physics.momentum, 0);
                gravity.grounded = false;
            }
            else{
                physics.momentum = physics.basespeed;
            }
        }
        // else if(!control.pressed("LEFT") && game.counter%40===0){
        //     physics.decelerate(PIX*0.1);
        // }

        if( control.pressed("LEFT") ){
            if(control.direction=="right")
                physics.momentum = physics.basespeed;
            // if(control.direction=="left" && game.counter%40===0)
            //     physics.accelerate(PIX);

            control.direction = "left";

            if(player.sprite.cx()>game.bounds.left && !gravity.grounded){
                player.move(-physics.momentum, 0);
                gravity.grounded = false;
            }
            else{
                physics.momentum = physics.basespeed;
            }


        }
        // else if(!control.pressed("RIGHT") && game.counter%40===0){
        //     physics.decelerate(PIX*0.1);
        // }

        if( control.pressed("A") ){
            player.move(0, gravity.lift);
            gravity.grounded = false;
        }
    };

    game.add(update, 'update');
    game.add(tween, 'tween');
    game.run();
    window.game = game;



});