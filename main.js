SVG.on(document, 'DOMContentLoaded', function(){
const PIX = 2;
const DIM = 8;
const GRAVITY = 0.12;
const DELAY = 350;
const TOP = 25000;

var game,
    physics,
    gravity,
    control,
    sound,
    fish,
    bolt,
    player,
    balloon,
    stage,
    start,
    waterline = 0,
    low_alt = false,
    low_alt_timer = 0,
    low_alt_duration = 0,
    distance = 0,
    ratio  = {},
    frames = {},
    screen = SVG('screen').attr('id', 'game'),
    top = top===undefined ? TOP : top,
    b = bitmap,
    palette = [
        [null, '#f06', '#06f', '#fc9'],
        [null, '#9f9', '#06f', '#fff'],
        [null, '#06f', '#3cf', '#fff'],
        [null, '#f60', '#09f', '#9f9'],
        [null, '#f90', '#fff']
    ];

    var init = function(){
        document.getElementById('screen').style.cursor = 'none';

        stage = screen.rect(800, 480).attr('id', 'backdrop');
        stage.fill('#000');

        game = new Game(screen);
        game.init({ bounds:{ top: 0, bottom: stage.y() + stage.bbox().height, left: 0, right: stage.x() + stage.bbox().width} })

        game.cast.balloons = [];
        game.cast.bolts    = [];
        game.tiles.stars   = [];
        game.score = 0;

        game.util   = new Utilities(game);
        game.events = new EventRegistry(game);

        set_player();
        set_sprites();
        set_water();
        set_fish();
        set_stars();

        physics = new Physics(game);
        gravity = physics.gravity(player.sprite, GRAVITY);
        physics.speedRange(0, PIX*2);

        set_controls();
        set_display();
        set_title();

        game.start(function(){
            game.layers.title.opacity(0);
            game.layers.title.remove();

            sound = new Sound(game);
            sound.init([
                {name: 'music',  src: 'sounds/trip.mp3'  },
                {name: 'burst',  src: 'sounds/burst.mp3' },
                {name: 'pause',  src: 'sounds/pause.mp3' },
                {name: 'dead',   src: 'sounds/clear.mp3' },
                {name: 'flap',   src: 'sounds/flap.mp3'  },
                {name: 'fall',   src: 'sounds/fall.mp3'  },
                {name: 'buzz',   src: 'sounds/buzz.wav'  },
                {name: 'splash', src: 'sounds/splash.wav'}
            ]);

            sound.onload(function(){
                delete game.layers.title;
                // a little delay added for safari, so sound plays properly upon game start
                setTimeout(function(){
                    sound.loop('music', 0.5);
                    control.unlock();
                    game.run();
                }, 200);
            });

            set_course();
        });
    };

    var set_controls = function(){
        control = new Controller(game);
        control.init();
        control.lock();

        control.set("left",  function(){
            if(!game.started && game.state=="running") game.started = true;
            physics.momentum = physics.basespeed;
            player.turn("left");
        });

        control.set("right", function(){
            if(!game.started && game.state=="running") game.started = true;
            physics.momentum = physics.basespeed;
            player.turn("right");
        });

        control.set("a", function(){
            if(!game.started && game.state=="running") game.started = true;
            game.frame = game.frame < 3 ? game.frame + 1 : 0;
            player.animate(game.frame);
        });

        control.set("pause", function(event){
            if(event!==undefined)
                event.preventDefault();

            if(this.game.state!=this.game.states["RUNNING"] && !game.started && !this.game.PAUSED){
                this.game.start();
                game.textbox.status.text("");
            }
            else if(this.game.state=="game over"){
                reset();
            }
            else if(!this.game.PAUSED){
                this.game.pause();
                sound.pause('music');
                sound.play('pause');
                game.textbox.status.text("PAUSE");
            }
            else{
                sound.audio.pause.time = 0;
                sound.play('pause');
                setTimeout(function(){sound.loop('music', 0.5);}, 500);
                game.textbox.status.text("");
                this.game.run();
            }
        });
    };

    var set_display = function(){
        game.display('score', 10, 10, {'family':'Press Start 2P', 'fill':'#fff', 'size':12});
        game.display('top', screen.bbox().cx-80, 10, {'family':'Press Start 2P', 'fill':'#fff', 'size':12});
        game.display('rank', game.bounds.right-120, 10, {'family':'Press Start 2P', 'fill':'#fff', 'size':12});
        game.display('status', screen.bbox().cx, screen.bbox().cy, {'family':'Press Start 2P', 'fill':'#fff', 'size':12, anchor:'middle'});
        game.display('start', screen.bbox().cx, screen.bbox().cy, {'family':'Press Start 2P', 'fill':'#fff', 'size':12, anchor:'middle'});
        game.textbox.score.text("PLAYER: 0000000000");
        game.textbox.rank.text("RANK: 50");
        game.textbox.top.text('TOP: ' + "0".repeat(10 - String(top).length) + top);
    };

    var set_player = function(){
        var dude    = [],
            frame   = [],
            balloon = [];

        player = new Sprite(game, palette[0], DIM, PIX);

        dude[0] = [b[0],  b[1],  b[2],  b[3]];
        dude[1] = [b[0],  b[8],  b[2],  b[9]];
        dude[2] = [b[0],  b[10], b[2],  b[11]];
        dude[3] = [b[14], b[8],  b[2],  b[9]];
        dude[4] = [b[39], b[40], b[41], b[42]];
        dude[5] = [b[47], b[48], b[49], b[50]];
        dude[6] = [b[51], b[52]];
        dude[7] = [b[53], b[54], b[55], b[56]];

        balloon[0] = [b[4],  b[5], b[6],  b[7]];
        balloon[1] = [b[12], b[5], b[13], b[7]];

        frame[0] = player.group(player.draw(dude[0], {x:0, y:DIM*2*PIX}), player.draw(balloon[0])).opacity(0);
        frame[1] = player.group(player.draw(dude[1], {x:0, y:DIM*2*PIX}), player.draw(balloon[0])).opacity(0);
        frame[2] = player.group(player.draw(dude[2], {x:0, y:DIM*2*PIX}), player.draw(balloon[0])).opacity(0);
        frame[3] = player.group(player.draw(dude[3], {x:0, y:DIM*2*PIX + 2*PIX}), player.draw(balloon[1], { x:0, y: 2*PIX })).opacity(0);
        frame[4] = player.group(player.flip(dude[0], {x:0, y:DIM*2*PIX}), player.flip(balloon[0])).opacity(0);
        frame[5] = player.group(player.flip(dude[1], {x:0, y:DIM*2*PIX}), player.flip(balloon[0])).opacity(0);
        frame[6] = player.group(player.flip(dude[2], {x:0, y:DIM*2*PIX}), player.flip(balloon[0])).opacity(0);
        frame[7] = player.group(player.flip(dude[3], {x:0, y:DIM*2*PIX + 2*PIX}), player.flip(balloon[1], { x:0, y: 2*PIX })).opacity(0);

        player = player.define('left',  [frame[0], frame[1], frame[2], frame[3]]);
        player = player.define('right', [frame[4], frame[5], frame[6], frame[7]]);
        player.direction = 'left';

        game.layers.sprites.add(player.sprite);

        player.dead = player.draw(dude[4], {x:0, y:0});
        player.dead.opacity(0);
        player.zapped = player.draw(dude[7], {x:0, y:0});
        player.zapped.opacity(0);

        player.standing = player.group(player.draw(dude[5]), player.draw(dude[6], {x:0, y:DIM*PIX*2}));

        game.layers.sprites.add(player.dead);
        game.layers.sprites.add(player.standing);

        start = {x: stage.x() + stage.bbox().width - player.sprite.bbox().width*3, y:stage.y() + stage.bbox().height/2 };
        player.sprite.move(start.x, start.y - player.sprite.bbox().height-12);
        player.standing.move(start.x, start.y - player.sprite.bbox().height);

        // draw start platform
        game.layers.background.rect(60, 20).radius(5).stroke({'width':PIX, 'color':'#ddd'}).move(start.x, start.y);
    };

    var set_sprites = function(){
        set_balloons();
        set_bolts();
    };

    var set_water = function(){
        var water = new Sprite(game, palette[2], DIM, PIX);
        for(var i=0, l=game.bounds.right; i<l-DIM*PIX; i+=DIM*PIX){
            var w = water.draw( [b[43], b[44], b[45], b[46]], { x:0, y:0} ).attr('class', 'water');
            game.layers.foreground.add(w.move(i, game.bounds.bottom-DIM*PIX*2));
        }
        waterline = stage.bbox().height-player.sprite.bbox().height*2
    };

    var set_title = function(){
        var x = 150;
        var y = 100;
        var pix = PIX;
        var t40 = new Sprite(game, palette[4], 40, pix);
        var t32 = new Sprite(game, palette[4], 32, pix);
        var t24 = new Sprite(game, palette[4], 24, pix);
        var t16 = new Sprite(game, palette[4], 16, pix);
        game.layers.title.rect('100%','100%').fill('#000');
        game.layers.title.add(t32.draw(alpha.b, {x:x, y:y}));
        game.layers.title.add(t32.draw(alpha.a, {x:x+32*pix,  y:y}));
        game.layers.title.add(t24.draw(alpha.l, {x:x+64*pix,  y:y}));
        game.layers.title.add(t24.draw(alpha.l, {x:x+88*pix,  y:y}));
        game.layers.title.add(t32.draw(alpha.o, {x:x+112*pix, y:y}));
        game.layers.title.add(t32.draw(alpha.o, {x:x+144*pix, y:y}));
        game.layers.title.add(t40.draw(alpha.n, {x:x+176*pix, y:y}));
        game.layers.title.add(t32.draw(alpha.f, {x:x+56*pix, y:y+48*pix}));
        game.layers.title.add(t24.draw(alpha.l, {x:x+88*pix, y:y+48*pix}));
        game.layers.title.add(t16.draw(alpha.i, {x:x+112*pix, y:y+48*pix}));
        game.layers.title.add(t32.draw(alpha.g, {x:x+128*pix, y:y+48*pix}));
        game.layers.title.add(t32.draw(alpha.h, {x:x+160*pix, y:y+48*pix}));
        game.layers.title.add(t32.draw(alpha.t, {x:x+192*pix, y:y+48*pix}));
        game.layers.title.text("PRESS SPACE")
        .move(screen.bbox().cx, y+256)
            .font({'family':'Press Start 2P', 'fill':'#fff', 'size':12, anchor:'middle'});
        game.layers.title.text("©2019  PRETENDO")
            .move(screen.bbox().cx, y+310)
            .font({'family':'Press Start 2P', 'fill':'#fff', 'size':12, anchor:'middle'});
    }

    var set_fish = function(){
        fish = new Sprite(game, palette[3], DIM, PIX);

        frames.fish = [];
        frames.fish[0] = fish.draw([b[57], b[58], b[59], b[60]], {x:0, y:0}).opacity(0);
        frames.fish[1] = fish.draw([b[61], b[62], b[63], b[64]], {x:0, y:0}).opacity(0);
        frames.fish[2] = fish.draw([b[65], b[66], b[67], b[68], b[69], b[70]], {x:0, y:0}).opacity(0);
        frames.fish[3] = fish.draw([b[71], b[72], b[73], b[74]], {x:0, y:0}).opacity(0);
        frames.fish[4] = fish.draw([b[75], b[76], b[77], b[78]], {x:0, y:0}).opacity(0);
        frames.fish[5] = fish.draw([b[79], b[80], b[81], b[82]], {x:0, y:0}).opacity(0);
        fish    = fish.add(frames.fish[0], frames.fish[1], frames.fish[2], frames.fish[3], frames.fish[4], frames.fish[5]);
    };

    var inactive = function(sprites){
        return sprites.filter(function(item){ return !item.visible(); });
    };

    var set_bolts = function(){
        var buzz;

        bolt = new Sprite(game, palette[1], DIM, PIX*0.75);
        frames.bolt = [
            [[[b[23], b[24], b[25], b[26]], { x:0, y: 0}]],
            [[[b[27], b[28], b[29], b[30]], { x:0, y: 0}]],
            [[[b[31], b[32], b[33], b[34]], { x:0, y: 0}]],
            [[[b[35], b[36], b[37], b[38]], { x:0, y: 0}]]
        ];

        for(i=0, l=16; i<l; i++){
            buzz = bolt.factory('bolts', frames.bolt).position(0, 0).hide();
            game.layers.objects.add(buzz.sprite.attr('class', 'bolt'));
        }
    };

    var set_balloons = function(){
        var bln, bal = [];

        balloon = new Sprite(game, palette[1], DIM, PIX);

        bal[0] = [b[15], b[16], b[17], b[18]];
        bal[1] = [b[19], b[20]];
        bal[2] = [b[21], b[22]];

        frames.balloon = [
            [[bal[0], { x:0, y: 0}], [bal[1], { x:0, y: DIM*2*PIX }]],
            [[bal[0], { x:0, y: 0}], [bal[2], { x:0, y: DIM*2*PIX }]],
            [[bal[0], { x:0, y: 0}], [bal[2], { x:0, y: DIM*2*PIX }]],
            [[bal[0], { x:0, y: 0}], [bal[1], { x:0, y: DIM*2*PIX }]]
        ];

        for(i=0, l=8; i<l; i++){
            bln = balloon.factory('balloons', frames.balloon).hide();
            game.layers.objects.add(bln.sprite.move(0, 0).attr('class', 'balloon'));
        }
    };

    var set_stars = function(){
        for(i=0, l=15; i<l; i++){
            var x = randomInt(0, stage.bbox().width),
                y = randomInt(10, stage.bbox().height),

            star = game.layers.background.rect(1,1).fill('#06f').attr('class', 'star').move(x, y).opacity(0);

            if(i<6) star.move(x, y).opacity(1);

            game.tiles.stars.push(star);
        }
    };

    var set_course = function(){
        var i, l, buzz, bal, locs, x = 300, y = 100, w = DIM*2;

        locs = [
            {x:x, y:y},{x:x+w, y:y+w}, {x:x+w*2, y:y+w*2},
            {x:x-w*16, y:y}, {x:x-w*17, y:y}, {x:x-w*18, y:y+w},
            {x:x-w*8, y:y+w*3}, {x:x-w*9, y:y+w*4}, {x:x-w*10, y:y+w*5},
            {x:x-w*8, y:y+w*12}, {x:x-w*9, y:y+w*13}, {x:x-w*10, y:y+w*14}, {x:x-w*11, y:y+w*14},
            {x:x-w*7, y:y+w*20}, {x:x-w*6, y:y+w*20}, {x:x-w*5, y:y+w*20}, {x:x-w*4, y:y+w*20}, {x:x-w*3, y:y+w*19}, {x:x-w*2, y:y+w*18}, {x:x-w, y:y+w*18}
        ];

        for(i=0, l=locs.length; i<l; i++){
            buzz = bolt.factory('bolts', frames.bolt);
            game.layers.objects.add(buzz.sprite.move(locs[i].x, locs[i].y).addClass('bolt'));
        }

        locs = [{x:x-4*w, y:y-2*w}, {x:x-w*15, y:y+w*3}, {x:x-w*15, y:y+w*16}, {x:x-4*w, y:y+w*13}];

        for(i=0, l=locs.length; i<l; i++){
            bal = balloon.factory('balloons', frames.balloon);
            game.layers.objects.add(bal.sprite.move(locs[i].x, locs[i].y).addClass('balloon'));
        }
    };

    var randomInt = function(min, max){
        // The maximum is exclusive and the minimum is inclusive
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    var generate = function(){
        var x,
            cl,
            bolt,
            bolts,
            balloon,
            balloons,
            total = game.cast.bolts.length + game.cast.balloons.length,
            d1 = Math.random(),
            d2 = Math.random(),
            d3 = Math.random(),
            d4 = Math.random(),

            y1 = randomInt(player.height(), waterline),
            y2 = randomInt(player.height()/2, waterline + player.height()),
            y3 = randomInt(0, stage.bbox().height);

        ratio.balloon = distance>150 ? 0.05 : 0.03;
        ratio.bolt    = distance>100 ? 0.25 : 0.15;
        ratio.moving  = distance>250 ? 0.50 : 0.30;
        ratio.star    = 0.3;

        // generate balloons
        if(d1<ratio.balloon){
            balloons = inactive(game.cast.balloons);

            if(balloons.length){
                balloon = balloons[0];
                x = stage.x()-game.layers.objects.x();

                balloon.position(x, y1).show();

                for(var i=0, l=game.cast.bolts.length; i<l; i++){
                    if(game.cast.bolts[i]!==undefined){
                        if(balloon.collision(game.cast.bolts[i]))
                            balloon.sprite.dmove(-game.cast.bolts[i].width()*2, 0)
                    }
                }
            }
        }
        // generate bolts
        if(d2<ratio.bolt){
             bolts = inactive(game.cast.bolts);

            if(bolts.length){
                bolt = bolts[0];
                x = stage.x()-game.layers.objects.x()-bolt.width()*4;

                if(distance>150 && d4<ratio.moving){
                    switch(randomInt(0,4)){
                        case 0:
                            cl = "N";
                            y2 = game.bounds.bottom;
                            break;
                        case 1:
                            cl = "S";
                            y2 = game.bounds.top;
                            break;
                        case 2:
                            cl = "NE";
                            y2 = game.bounds.bottom;
                            break;
                        case 3:
                            cl = "SE";
                            y2 = game.bounds.top;
                            break;
                        case 3:
                            cl = "E";
                            break;
                    }
                    bolt.position(x, y2).classes(["bolt", cl]).show();
                }
                else{
                    bolt.position(x, y2).class("bolt").show();
                }
            }
        }

        if(d3<ratio.star){
            for(var i=0, l=game.tiles.stars.length; i<l; i++){
                var star = game.tiles.stars[i];
                if(star.opacity()===0){
                    star.opacity(1).move(0, y3);
                    break;
                }
            }
        }

        for(var i=0, l=game.cast.balloons.length; i<l; i++){
            var balloon = game.cast.balloons[i];
            var exit = stage.bbox().width - (balloon.sprite.x()+game.layers.objects.x()) < 0;
            if(exit) game.cast.balloons[i].hide();
        }

        for(var i=0, l=game.cast.bolts.length; i<l; i++){
            var bolt  = game.cast.bolts[i];
            var exit  = stage.bbox().width - (bolt.sprite.x()+game.layers.objects.x()) < 0;
            var exitN = bolt.sprite.y() < 0;
            var exitS = stage.bbox().height - (bolt.sprite.y()+game.layers.objects.y()) < 0;
            if(exit || exitN || exitS) game.cast.bolts[i].hide();
        }
    };

    var update = function(){
        var digits;
        if( control.pressed("RIGHT") ){
            if(player.standing.opacity())
                player.standing.opacity(0);

            if(control.direction=="right")
                physics.accelerate(PIX/2);
            else if(control.direction=="left")
                physics.decelerate(PIX);

            if(!control.pressed("A"))
                player.animate(game.frame);
        }

        if( control.pressed("LEFT") ){
            if(player.standing.opacity())
                player.standing.opacity(0);

            if(control.direction=="left")
                physics.accelerate(PIX/8);
            else if(control.direction=="right")
                physics.decelerate(PIX/2);

            if(!control.pressed("A"))
                player.animate(game.frame);
        }

        if( control.pressed("A") ){
            if(player.standing.opacity())
                player.standing.opacity(0);

            player.animate(game.frame);

            if(game.counter%10===0){
                sound.audio.flap.time = 0;
                sound.play('flap');
            }
        }

        generate();

        for(var i=0, l=game.cast.bolts.length; i<l; i++){
            game.cast.bolts[i].animate(game.frame);
        }

        if(game.counter%20===0){
            for(var i=0, l=game.cast.balloons.length; i<l; i++){
                if(game.cast.balloons[i]!==undefined){
                    game.cast.balloons[i].animate(game.frame);
                }
            }
            game.score += 10;
            distance += 10;

            if(game.score<TOP){
                game.textbox.rank.text("RANK: " + Math.ceil(50-(game.score / (TOP / 50))));
            }
            else{
                top = game.score;
                game.textbox.rank.text("RANK: 1");
                digits = String(game.score).length;
                digits = 10 - digits;
                game.textbox.top.text('TOP: ' + "0".repeat(digits) + game.score);
            }
        }

        digits = String(game.score).length;
        digits = 10 - digits;
        game.textbox.score.text('PLAYER: ' + "0".repeat(digits) + game.score);

        if(player.sprite.y() >= waterline-DIM*PIX){
            low_alt = true;
            low_alt_timer = low_alt_timer===0 ? Date.now() : low_alt_timer
            low_alt_duration = Date.now() - low_alt_timer;
        }
        else{
            low_alt = false;
            low_alt_timer = 0;
            low_alt_duration = 0;
        }
    };

    var tween = function(){
        var digits;
        if(low_alt_duration>1500){
            eaten();
        }
        else{
            if( !physics.vector.bouncing && control.pressed("RIGHT") ){
                control.direction = "right";

                physics.vector.direction = control.pressed("A") ? 'NE' : 'E';

                if(player.sprite.cx()<game.bounds.right && !gravity.grounded && game.state==game.states.RUNNING){
                    player.move(physics.momentum, 0);
                }
                else{
                    physics.momentum = 0;
                }
            }

            if( !physics.vector.bouncing && control.pressed("LEFT") ){
                control.direction = "left";

                physics.vector.direction = control.pressed("A") ? 'NW' : 'W';


                if(player.sprite.cx()>game.bounds.left && !gravity.grounded && game.state==game.states.RUNNING){
                    player.move(-physics.momentum, 0);
                }
                else{
                    physics.momentum = 0;
                }
            }

            if( !physics.vector.bouncing && control.pressed("A") ){
                if(!control.pressed('RIGHT') && !control.pressed('LEFT')){
                    physics.momentum = 0;
                    control.direction = "up";
                    physics.vector.direction = 'N';
                }

                if(player.sprite.cy() < game.bounds.top){
                    physics.deflect(player.sprite);
                }else{
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
                if(player.collision(game.cast.balloons[i]) && game.cast.balloons[i].visible()){
                    sound.play('burst');
                    game.cast.balloons[i].hide();

                    game.score += 300;
                    digits = String(game.score).length;
                    digits = 10 - digits;
                    game.textbox.score.text('PLAYER: ' + "0".repeat(digits) + game.score);
                }
            }

            for(var i=0, l=game.cast.bolts.length; i<l; i++){
                if(player.collision(game.cast.bolts[i])){
                    gameover();
                }
            }

            if(control.pressed("A"))
                gravity.float(DELAY);
        }
    };

    var scroll = function(){
        var items = game.layers.objects.children();
        var background = game.layers.background.children();

        for(var i=0, l=items.length; i<l; i++){
            var type = items[i].classes();
            var index = type.indexOf("bolt");
            if(type.length>1 && index>-1){
                type.splice(index, 1);
                switch(type[0]){
                    case "N":
                        items[i].dmove(PIX*0.75, -PIX*0.75);
                        break;
                    case "NE":
                        items[i].dmove(PIX*1.25, -PIX*0.75);
                        break;
                    case "E":
                        items[i].dmove(PIX*1.25, 0);
                        break;
                    case "SE":
                        items[i].dmove(PIX*1.25, PIX*0.75);
                        break;
                    case "S":
                        items[i].dmove(PIX*0.75, PIX*0.75);
                        break;
                }
            }
            else{
                items[i].dmove(PIX*0.75);
            }
        }

        for(var i=0, l=background.length; i<l; i++){
            background[i].dmove(PIX*0.5);
            if(background[i].x()>=game.bounds.right){
                background[i].opacity(0);
            }
        }

        if(!game.started && player.position().x<game.bounds.right-player.sprite.bbox().width){
            player.standing.dmove(PIX/2);
            player.move(PIX/2);
        }
        if(player.position().x==game.bounds.right-player.sprite.bbox().width){
            game.started = true;
            player.standing.opacity(0);
            player.animate(game.frame);
        }
    };

    var gameover = function(){
        game.state = game.states.GAME_OVER;
        sound.stop('music');
        sound.loop('buzz');
        player.dead.move(player.sprite.x(), player.sprite.y()).opacity(1);
        player.sprite.opacity(0);
        var buzzing = true;

        var electrocute = function(){
            if(Date.now()%2===0 && buzzing){
                player.zapped.move(player.dead.x(), player.dead.y())
                player.dead.opacity(0);
                player.zapped.opacity(1);
            }
            else{
                player.dead.opacity(1);
                player.zapped.opacity(0);
            }

            if(buzzing) requestAnimationFrame(electrocute);
        }

        player.dead.animate(600).dmove(0, -2*player.dead.bbox().height);
        requestAnimationFrame(electrocute);

        setTimeout(function(){
            sound.stop('buzz');
            buzzing = false;
            player.dead.animate().dmove(0, game.bounds.bottom-player.sprite.y()+player.dead.bbox().height);
            setTimeout(function(){ sound.play('fall', 0.3); }, 200);
            setTimeout(function(){ sound.stop('fall'); }, 1200);
            setTimeout(function(){
                sound.play('dead', 0.4);
                game.textbox.status.text("GAME OVER");
                setTimeout(reset, 5000);
            }, 1200);
        }, 800);
    };

    var fish_animation = function(f){
        requestAnimationFrame(function(){
            if(game.counter%10===0 && fish.frame<fish.frames.length)
                fish.frame++;
        });

        if(fish.frame===0)
            fish.sprite.move(player.sprite.x() - player.sprite.bbox().width, waterline + player.sprite.bbox().height + (DIM*PIX)/4);
        else if(fish.frame==1)
            fish.sprite.move(player.sprite.x() - player.sprite.bbox().width, waterline + player.sprite.bbox().height + (DIM*PIX)/4);
        else if(fish.frame==2)
            fish.sprite.move(player.sprite.x() - player.sprite.bbox().width*0.75, waterline + player.sprite.bbox().height-(DIM*PIX)/2);
        else if(fish.frame==3)
            fish.sprite.move(player.sprite.x() - player.sprite.bbox().width*0.5, waterline + player.sprite.bbox().height-(DIM*PIX)/2);
        else if(fish.frame==4)
            fish.sprite.move(player.sprite.x(), waterline + player.sprite.bbox().height - (DIM*PIX)/2);
        else if(fish.frame==5)
            fish.sprite.move(player.sprite.x(), waterline + player.sprite.bbox().height - (DIM*PIX)/2);
    };

    var eaten = function(){
        if(game.state!=game.states.END_LOOP){
            sound.stop('music');
            sound.play('splash');
            player.sprite.opacity(0);
            player.dead.move(player.sprite.x(),  waterline + player.sprite.bbox().height);
            game.state = game.states.END_LOOP;
        }

        if(fish.frame==4){
            player.dead.opacity(0);
            player.dead.remove();
        }
        else{
            player.dead.opacity(1);
        }

        fish.animate(fish.frame, fish_animation);

        if(fish.frame>=fish.frames.length){
            sound.play('dead', 0.4);
            game.state = game.states.GAME_OVER;
            game.textbox.status.text("GAME OVER");
            setTimeout(reset, 5000);
        }
    }

    var reset = function(){
        if(game.state==game.states.GAME_OVER){
            for(var i in game.layers){
                game.layers[i].remove();
                delete game.layers[i];
                game.layers[i] = screen.group().attr('id', i);
            }
            init();
            run();
        }
    };

    var run = function(){
        game.add(update, 'update');
        game.add(tween, 'tween');
    };

    init();
    run();
    window.game = game;
});