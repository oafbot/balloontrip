function Game(screen){
    var self = this,
        KEYFRAME = 8;

    this.counter = 0;
    this.frame = 0;
    this.started = false;
    this.screen = screen;
    this.time = 0;
    this.storage = window.localStorage;
    this.fps = 32;
    this.interval = 1000/this.fps;
    this.timestamp = 0;
    this.mode = "";

    this.queue  = {update:[], tween:[]};
    this.bounds = {top:0, bottom:undefined, right:undefined, left:0};
    this.layers = {
        background : screen.group().attr('id', 'background'),
        sprites    : screen.group().attr('id', 'sprites'),
        obstacles  : screen.group().attr('id', 'obstacles'),
        objects    : screen.group().attr('id', 'objects'),
        foreground : screen.group().attr('id', 'foreground'),
        text       : screen.group().attr('id', 'text'),
        title      : screen.group().attr('id', 'title')
    };
    this.cast = {};
    this.tiles = {};
    this.state = 0;
    this.funcs = {};
    this.textbox = [];
    this.audio = {
        on : true,
    };

    this.states = {
        "START"     : "start",
        "RUNNING"   : "running",
        "PAUSED"    : "paused",
        "END_LOOP"  : "end loop",
        "GAME_OVER" : "game over"
    };

    this.update = function(timestamp){
        for(var i=0, l=this.queue.update.length; i<l; i++){
            this.queue.update[i]();
        }
    };

    this.tween = function(timestamp){
        for(var i=0, l=this.queue.tween.length; i<l; i++){
            this.queue.tween[i]();
        }
    }

    this.add = function(fn, key){
        this.queue[key].push(fn);
    }

    this.loop = function(timestamp){
        if(self.time===0)
            self.time = timestamp;
        self.timestamp = timestamp;

        if(!self.PAUSED && self.state!="game over"){
            self.clock(timestamp);

            if(self.counter%KEYFRAME===0){
                self.update();
                self.frame = self.frame < 3 ? self.frame + 1 : 0;
            }else if(self.delta>self.interval){
                self.tween();
                self.time = timestamp - (self.time%self.interval);
            }
            requestAnimationFrame(self.loop);
        }
    };

    this.clock = function(timestamp) {
        this.delta = this.time>0 ? timestamp - this.time : 0;
        this.counter++;
        // self.time = timestamp;
    };

    this.run = function(){
        this.PAUSED = false;
        requestAnimationFrame(this.loop);
        this.state = this.states["RUNNING"];
        this.audio.on = true;
        // console.log("running.")
    };

    this.start = function(fn){
        if(fn!==undefined){
            this.funcs.start = fn;
        }
        else if(this.funcs.hasOwnProperty('start')){
            this.funcs.start();
        }
    };

    this.pause = function(){
        this.PAUSED = true;
        this.state = this.states["PAUSED"];
        this.audio.on = false;
        // console.log("paused.");
    }

    this.gameover = function(){
        this.GAME_OVER = true;
        this.state = this.states["GAME_OVER"];
    };

    this.display = function(name, x, y, options){
        this.textbox[name] = this.layers.text.text("");
        this.textbox[name].move(x, y);
        this.textbox[name].font(options);
    };

    this.init = function(options){
        keys = Object.keys(options);
        for(var key in options){
            self[key] = options[key];
        }
    }
}