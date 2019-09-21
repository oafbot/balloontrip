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
    dude,
    dead,
    stand,
    electro,
    frame1,
    frame2,
    frame3,
    frame4,
    frame5,
    frame6,
    frame7,
    frame8,
    fish,
    fish1,
    fish2,
    fish3,
    fish4,
    fish5,
    fish6,
    fishy,
    digits,
    rank,
    stage,
    balloon,
    balloon_frames,
    bolt,
    bolt_frames,
    water,
    start,
    waterline,
    low_alt,
    low_alt_timer = 0,
    low_alt_duration = 0,
    distance = 0,
    player = {},

    screen = SVG('screen').attr('id', 'game'),
    top = top===undefined ? TOP : top;

    b = bitmap,

    dude1 = [b[0],  b[1],  b[2],  b[3]],
    dude2 = [b[0],  b[8],  b[2],  b[9]],
    dude3 = [b[0],  b[10], b[2],  b[11]],
    dude4 = [b[14], b[8],  b[2],  b[9]],
    dude5 = [b[39], b[40], b[41], b[42]],
    dude6 = [b[47], b[48], b[49], b[50]],
    dude7 = [b[51], b[52]],
    dude8 = [b[53], b[54], b[55], b[56]],

    bal1 = [b[4],  b[5], b[6],  b[7]],
    bal2 = [b[12], b[5], b[13], b[7]],
    bal3 = [b[15], b[16], b[17], b[18]],
    bal4 = [b[19], b[20]],
    bal5 = [b[21], b[22]],

    palette  = [null, '#f06', '#06f', '#fc9'],
    palette2 = [null, '#9f9', '#06f', '#fff'],
    palette3 = [null, '#06f', '#3cf', '#fff'],
    palette4 = [null, '#f60', '#09f', '#9f9'],
    palette5 = [null, '#f90', '#fff'];

    var init = function(){
        // var stage = screen.rect('100%', '60%');
        stage = screen.rect(800, 480).attr('id', 'backdrop');
        stage.fill('#000');

        game = new Game(screen);
        game.init({ bounds:{ top: 0, bottom: stage.y() + stage.bbox().height, left: 0, right: stage.x() + stage.bbox().width} })

        game.cast.balloons = [];
        game.cast.bolts    = [];
        game.score = 0;
        game.states.FISH_ATTACK = "fish attack";

        game.util   = new Utilities(game);
        game.events = new EventRegistry(game);

        dude = new Sprite(game, palette, DIM, PIX);
        // flip = new Sprite(game, palette, DIM, PIX);

        frame1 = dude.group(dude.draw(dude1, {x:0, y:DIM*2*PIX}), dude.draw(bal1)).opacity(0);
        frame2 = dude.group(dude.draw(dude2, {x:0, y:DIM*2*PIX}), dude.draw(bal1)).opacity(0);
        frame3 = dude.group(dude.draw(dude3, {x:0, y:DIM*2*PIX}), dude.draw(bal1)).opacity(0);
        frame4 = dude.group(dude.draw(dude4, {x:0, y:DIM*2*PIX + 2*PIX}), dude.draw(bal2, { x:0, y: 2*PIX })).opacity(0);

        frame5 = dude.group(dude.flip(dude1, {x:0, y:DIM*2*PIX}), dude.flip(bal1)).opacity(0);
        frame6 = dude.group(dude.flip(dude2, {x:0, y:DIM*2*PIX}), dude.flip(bal1)).opacity(0);
        frame7 = dude.group(dude.flip(dude3, {x:0, y:DIM*2*PIX}), dude.flip(bal1)).opacity(0);
        frame8 = dude.group(dude.flip(dude4, {x:0, y:DIM*2*PIX + 2*PIX}), dude.flip(bal2, { x:0, y: 2*PIX })).opacity(0);

        player = dude.define('left',  [frame1, frame2, frame3, frame4]);
        player = dude.define('right', [frame5, frame6, frame7, frame8]);
        player.direction = 'left';

        game.layers.sprites.add(player.sprite);

        balloon = new Sprite(game, palette2, DIM, PIX);
        balloon_frames = [
            [[bal3, { x:0, y: 0}], [bal4, { x:0, y: DIM*2*PIX }]],
            [[bal3, { x:0, y: 0}], [bal5, { x:0, y: DIM*2*PIX }]],
            [[bal3, { x:0, y: 0}], [bal5, { x:0, y: DIM*2*PIX }]],
            [[bal3, { x:0, y: 0}], [bal4, { x:0, y: DIM*2*PIX }]]
        ];

        bolt = new Sprite(game, palette2, DIM, PIX*0.75);
        bolt_frames = [
            [[ [b[23], b[24], b[25], b[26]], { x:0, y: 0} ]],
            [[[b[27], b[28], b[29], b[30]], { x:0, y: 0}]],
            [[[b[31], b[32], b[33], b[34]], { x:0, y: 0}]],
            [[[b[35], b[36], b[37], b[38]], { x:0, y: 0}]]
        ];

        water = new Sprite(game, palette3, DIM, PIX);
        for(var i=0, l=game.bounds.right; i<l-DIM*PIX; i+=DIM*PIX){
            var w = water.draw( [b[43], b[44], b[45], b[46]], { x:0, y:0} ).attr('class', 'water');
            game.layers.foreground.add(w.move(i, game.bounds.bottom-DIM*PIX*2));
        }
        waterline = stage.bbox().height-player.sprite.bbox().height*2

        var title = function(){
            var x = 150;
            var y = 100;
            var pix = PIX;
            var t40 = new Sprite(game, palette5, 40, pix);
            var t32 = new Sprite(game, palette5, 32, pix);
            var t24 = new Sprite(game, palette5, 24, pix);
            var t16 = new Sprite(game, palette5, 16, pix);
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

        fish = new Sprite(game, palette4, DIM, PIX);
        fish1 = fish.draw([b[57], b[58], b[59], b[60]], {x:0, y:0}).opacity(0);
        fish2 = fish.draw([b[61], b[62], b[63], b[64]], {x:0, y:0}).opacity(0);
        fish3 = fish.draw([b[65], b[66], b[67], b[68], b[69], b[70]], {x:0, y:0}).opacity(0);
        fish4 = fish.draw([b[71], b[72], b[73], b[74]], {x:0, y:0}).opacity(0);
        fish5 = fish.draw([b[75], b[76], b[77], b[78]], {x:0, y:0}).opacity(0);
        fish6 = fish.draw([b[79], b[80], b[81], b[82]], {x:0, y:0}).opacity(0);
        fishy = fish.add(fish1, fish2, fish3, fish4, fish5, fish6);

        dead = dude.draw(dude5, {x:0, y:0});
        dead.opacity(0);
        electro = dude.draw(dude8, {x:0, y:0});
        electro.opacity(0);

        stand = dude.group(dude.draw(dude6), dude.draw(dude7, {x:0, y:DIM*PIX*2}));

        game.layers.sprites.add(dead);
        game.layers.sprites.add(stand);

        start = {x: stage.x() + stage.bbox().width - player.sprite.bbox().width*3, y:stage.y() + stage.bbox().height/2 };
        player.sprite.move(start.x, start.y - player.sprite.bbox().height-12);
        stand.move(start.x, start.y - player.sprite.bbox().height);
        platform = game.layers.background.rect(60, 20).radius(5).stroke({'width':PIX, 'color':'#ddd'}).move(start.x, start.y);

        physics = new Physics(game);
        gravity = physics.gravity(player.sprite, GRAVITY);
        physics.speedRange(0, PIX*1.5);

        control = new Controller(game);
        control.init();

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

        control.set("a",     function(){
            if(!game.started && game.state=="running") game.started = true;
            game.frame = game.frame < 3 ? game.frame + 1 : 0;
            dude.animate(game.frame);
        });

        control.set("pause", function(){
            if(this.game.state!=this.game.states["RUNNING"] && !game.started){
                this.game.start();
                game.textbox.status.text("");
                rank = 50;
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
        })

        game.display('score', 10, 10, {'family':'Press Start 2P', 'fill':'#fff', 'size':12});
        game.display('top', screen.bbox().cx-80, 10, {'family':'Press Start 2P', 'fill':'#fff', 'size':12});
        game.display('rank', game.bounds.right-120, 10, {'family':'Press Start 2P', 'fill':'#fff', 'size':12});
        game.display('status', screen.bbox().cx, screen.bbox().cy, {'family':'Press Start 2P', 'fill':'#fff', 'size':12, anchor:'middle'});
        game.display('start', screen.bbox().cx, screen.bbox().cy, {'family':'Press Start 2P', 'fill':'#fff', 'size':12, anchor:'middle'});
        game.textbox.score.text("PLAYER: 0000000000");
        game.textbox.rank.text("RANK: 50");
        game.textbox.top.text('TOP: ' + "0".repeat(10 - String(top).length) + top);

        game.start(function(){
            game.layers.title.opacity(0);
            game.layers.title.remove();
            delete game.layers.title;

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
            sound.onload(function(){ sound.loop('music', 0.5); game.run(); });

            set_course();
        });

        title();
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
            buzz = bolt.factory('bolts', bolt_frames);
            game.layers.objects.add(buzz.sprite.move(locs[i].x, locs[i].y).addClass('bolt'));
        }

        locs = [{x:x-4*w, y:y-2*w}, {x:x-w*15, y:y+w*3}, {x:x-w*15, y:y+w*16}, {x:x-4*w, y:y+w*13}];

        for(i=0, l=locs.length; i<l; i++){
            bal = balloon.factory('balloons', balloon_frames);
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
        var b,
        total = game.cast.bolts.length + game.cast.balloons.length;
        more = distance>50/* && total<20*/,
        d1 = Math.random(),
        d2 = Math.random(),
        d3 = Math.random(),
        d4 = Math.random(),

        y1 = randomInt(player.sprite.bbox().height, waterline),
        y2 = randomInt(player.sprite.bbox().height/2, waterline + player.sprite.bbox().height),
        y3 = randomInt(0, stage.bbox().height);

        if(more){
            if(d1<0.05){
                b = balloon.factory('balloons', balloon_frames);
                game.layers.objects.add(b.sprite.move(stage.x()-game.layers.objects.x(), y1).attr('class', 'balloon'));

                for(var i=0, l=game.cast.bolts.length; i<l; i++){
                    if(game.cast.bolts[i]!==undefined){
                        if(b.collision(game.cast.bolts[i]))
                            b.sprite.dmove(-game.cast.bolts[i].sprite.bbox().width*2, 0)
                    }
                }
            }

            if(d2<0.15){
                var cl= 'bolt',
                    buzz = bolt.factory('bolts', bolt_frames),
                    x = stage.x()-game.layers.objects.x()-buzz.sprite.bbox().width*4;

                // game.layers.objects.add(buzz.sprite.move(x, y2).addClass(cl));

                if(distance>200 && d4<0.3){
                    switch(randomInt(0,4)){
                        case 0:
                            cl = "bolt N";
                            y2 = game.bounds.bottom;
                            break;
                        case 1:
                            cl = "bolt S";
                            y2 = game.bounds.top;
                            break;
                        case 2:
                            cl = "bolt NE";
                            y2 = game.bounds.bottom;
                            break;
                        case 3:
                            cl = "bolt SE";
                            y2 = game.bounds.top;
                            break;
                        case 3:
                            cl = "bolt E";
                            break;
                    }
                    // buzz = bolt.factory('bolts', bolt_frames);
                    // game.layers.objects.add(buzz.sprite.move(x, y2).addClass(cl));
                }

                game.layers.objects.add(buzz.sprite.move(x, y2).addClass(cl));
            }

            if(d3<0.3){
                var star = game.layers.background.rect(1,1).move(0, y3).fill('#06f').attr('class', 'star');
            }
        }

        game.layers.objects.select('.balloon').each(function(c, children){
            var exit = stage.bbox().width - (children[c].x()+game.layers.objects.x()) < 0;
            if(exit){
                for(var i=0, l=game.cast.balloons.length; i<l; i++){
                    if(game.cast.balloons[i]!==undefined && game.cast.balloons[i].sprite===children[c])
                        delete game.cast.balloons[i]
                }
                children[c].remove();
                delete children[c];
            }
        });

        game.layers.objects.select('.bolt').each(function(c, children){
            var exit = stage.bbox().width - (children[c].x()+game.layers.objects.x()) < 0;
            var exitN = children[c].y() < 0;
            var exitS = stage.bbox().height - (children[c].y()+game.layers.objects.y()) < 0;
            if(exit || exitN || exitS){
                for(var i=0, l=game.cast.bolts.length; i<l; i++){
                    if(game.cast.bolts[i]!==undefined && game.cast.bolts[i].sprite===children[c])
                        delete game.cast.bolts[i]
                }
                children[c].remove();
                delete children[c];
            }
        });
    };

    var update = function(){
        if( control.pressed("RIGHT") ){
            if(game.started && stand.opacity())
                stand.opacity(0);

            if(control.direction=="right" && game.counter%40===0)
                physics.accelerate(PIX*1.5);
            else if(control.direction=="left")
                physics.decelerate(PIX/2);

            if(!control.pressed("A"))
                dude.animate(game.frame);
        }

        if( control.pressed("LEFT") ){
            if(game.started && stand.opacity())
                stand.opacity(0);

            if(control.direction=="left" && game.counter%40===0)
                physics.accelerate(PIX/2);
            else if(control.direction=="right")
                physics.decelerate(PIX*1.5);

            if(!control.pressed("A"))
                dude.animate(game.frame);
        }

        if( control.pressed("A") ){
            if(game.started && stand.opacity())
                stand.opacity(0);

            dude.animate(game.frame);

            if(game.counter%10===0){
                sound.audio.flap.time = 0;
                sound.play('flap');
            }
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
            distance += 10;

            if(game.score<TOP){
                game.textbox.rank.text("RANK: " + Math.ceil(50-(game.score / (TOP / 50))));
            }
            else{
                top = game.score;
                rank = 1;
                game.textbox.rank.text("RANK: " + rank);
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

        if(low_alt_duration>1500){
            eaten();
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

        if( !physics.vector.bouncing && control.pressed("A") ){
            if(!control.pressed('RIGHT') && !control.pressed('LEFT')){
                physics.momentum = 0;
                // physics.decelerate(PIX);
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
            if(game.cast.balloons[i]!==undefined){

                if(player.collision(game.cast.balloons[i])){
                    // sound.audio.burst.time = 0;
                    // sound.audio.burst.playing = false;
                    sound.play('burst');

                    game.cast.balloons[i].sprite.remove();
                    delete game.cast.balloons[i];

                    game.score += 300;
                    digits = String(game.score).length;
                    digits = 10 - digits;
                    game.textbox.score.text('PLAYER: ' + "0".repeat(digits) + game.score);
                }
            }
        }

        cleanup(game.cast.balloons);
        cleanup(game.cast.bolts);

        if(game.state!=game.states.FISH_ATTACK)
            for(var i=0, l=game.cast.bolts.length; i<l; i++){
                if(game.cast.bolts[i]!==undefined){
                    if(player.collision(game.cast.bolts[i])){
                        gameover();
                    }
                }
            }

        if(control.pressed("A"))
            gravity.float(DELAY);
    };

    var cleanup = function(items){
        for(var i=0, l=items.length; i<l; i++)
            if(items[i]===undefined)
                items.splice(i, 1);
    }

    var scroll = function(){
        if(game.state!=game.states.FISH_ATTACK){
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
                background[i].dmove(PIX*0.50);
                if(background[i].x()>=game.bounds.right){
                    background[i].remove();
                    delete background[i];
                }
            }

            if(!game.started && player.position().x<game.bounds.right-player.sprite.bbox().width){
                stand.dmove(PIX/2);
                player.move(PIX/2);
            }
            if(player.position().x==game.bounds.right-player.sprite.bbox().width){
                game.started = true;
                stand.opacity(0);
                dude.animate(game.frame);
            }
        }
        // cleanup(game.cast.balloons);
        // cleanup(game.cast.bolts);
    };

    var gameover = function(){
        game.state = game.states.GAME_OVER;
        sound.stop('music');
        sound.loop('buzz');
        dead.move(player.sprite.x(), player.sprite.y()).opacity(1);
        player.sprite.opacity(0);
        var buzzing = true;

        var electrocute = function(){
            if(Date.now()%2===0 && buzzing){
                electro.move(dead.x(), dead.y())
                dead.opacity(0);
                electro.opacity(1);

            }
            else{
                dead.opacity(1);
                electro.opacity(0);
            }

            if(buzzing) requestAnimationFrame(electrocute);
        }

        dead.animate(600).dmove(0, -2*dead.bbox().height);
        requestAnimationFrame(electrocute);

        setTimeout(function(){
            sound.stop('buzz');
            buzzing = false;
            dead.animate().dmove(0, game.bounds.bottom-player.sprite.y()+dead.bbox().height);
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
            if(fishy.frame<fishy.frames.length)
                fishy.frame++;
        });

        if(fishy.frame===0)
            fishy.sprite.move(player.sprite.x() - player.sprite.bbox().width, waterline + player.sprite.bbox().height + (DIM*PIX)/4);
        else if(fishy.frame==1)
            fishy.sprite.move(player.sprite.x() - player.sprite.bbox().width, waterline + player.sprite.bbox().height + (DIM*PIX)/4);
        else if(fishy.frame==2)
            fishy.sprite.move(player.sprite.x() - player.sprite.bbox().width*0.75, waterline + player.sprite.bbox().height-(DIM*PIX)/2);
        else if(fishy.frame==3)
            fishy.sprite.move(player.sprite.x() - player.sprite.bbox().width*0.5, waterline + player.sprite.bbox().height-(DIM*PIX)/2);
        else if(fishy.frame==4)
            fishy.sprite.move(player.sprite.x(), waterline + player.sprite.bbox().height - (DIM*PIX)/2);
        else if(fishy.frame==5)
            fishy.sprite.move(player.sprite.x(), waterline + player.sprite.bbox().height - (DIM*PIX)/2);
    };

    var eaten = function(){
        game.state = game.states.FISH_ATTACK;

        fishy.animate(fishy.frame, fish_animation);

        if(game.state!="end loop"){
            sound.stop('music');
            sound.play('splash');
            game.state = game.states.END_LOOP;
            dead.move(player.sprite.x(),  waterline + player.sprite.bbox().height).opacity(1);
            player.sprite.opacity(0);
        }

        if(fishy.frame==4){
            dead.opacity(0);
            dead.remove();
        }

        if(fishy.frame>=fishy.frames.length){
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