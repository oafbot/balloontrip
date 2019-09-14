function Controller(game){
    var KEY_INTERVAL = 300,
    self = this,

    keys  = {
        "LEFT"       : 37,  // ←
        "UP"         : 38,  // ↑
        "RIGHT"      : 39,  // →
        "DOWN"       : 40,  // ↓
        "PAUSE"      : 32,  // space
        "A"          : 90,  // z
        "B"          : 88,  // x
        "MUSIC"      : 77,  // m
        "COMBAT"     : 191, // slash
        "LEFT_ALT"   : 65,  // a
        "RIGHT_ALT"  : 68,  // d
        "UP_ALT"     : 87,  // w
        "DOWN_ALT"   : 83,  // s
    };

    this.game = game;
    this.keypress;

    this.left  = function(){};
    this.up    = function(){};
    this.right = function(){};
    this.down  = function(){};
    this.a     = function(){};
    this.b     = function(){};

    this.pressed = function(key){
        if(Object.keys(self.keypress).indexOf(String(keys[key]))>=0)
            return true;
        return false;
    };

    this.init = function(direction){
        var opts = {};
        opts[keys.PAUSE]     = function(){ self.pause(); };
        opts[keys.LEFT]      = function(){ if(!self.game.PAUSED) self.left();  };
        opts[keys.UP]        = function(){ if(!self.game.PAUSED) self.up();    };
        opts[keys.RIGHT]     = function(){ if(!self.game.PAUSED) self.right(); };
        opts[keys.DOWN]      = function(){ if(!self.game.PAUSED) self.down();  };
        opts[keys.A]         = function(){ if(!self.game.PAUSED) self.a()      };
        opts[keys.B]         = function(){ if(!self.game.PAUSED) self.b()      };
        opts[keys.LEFT_ALT]  = function(){ if(!self.game.PAUSED) self.left();  };
        opts[keys.UP_ALT]    = function(){ if(!self.game.PAUSED) self.up();    };
        opts[keys.RIGHT_ALT] = function(){ if(!self.game.PAUSED) self.right(); };
        opts[keys.DOWN_ALT]  = function(){ if(!self.game.PAUSED) self.down();  };
        this.keyboard(opts, KEY_INTERVAL);
        game.controls = this;
        this.direction = direction;
    };

    this.keyboard = function KeyboardController(keys, repeat){
        /* Lookup of key codes to timer ID, or null for no repeat */
        var timers= {};
        self.keypress = timers;

        /**
        * When key is pressed and we don't already think it's pressed, call the
        * key action callback and set a timer to generate another one after a delay 
        */
        document.onkeydown = function(event) {
            var key= (event || window.event).keyCode;
            if (!(key in keys))
                return true;

            if (!(key in timers)) {
                timers[key]= null;
                keys[key]();
                if (repeat!==0)
                    requestAnimationFrame(function(){ /*console.log(key);*/  timers[key] = true; });
                    // timers[key] = setInterval(keys[key], repeat);
            }
            return false;
        };

        /* Cancel timeout and mark key as released on keyup */
        document.onkeyup = function(event) {
            var key= (event || window.event).keyCode;
            if (key in timers) {
                // if (timers[key]!==null)
                    // clearInterval(timers[key]);
                requestAnimationFrame(function(){ delete timers[key]; });
            }
        };

        /**
        * When window is unfocused we may not get key events. 
        * To prevent this causing a key to 'get stuck down', cancel all held keys 
        */
        window.onblur= function() {
            // for (key in timers)
            //     if (timers[key]!==null)
                    // clearInterval(timers[key]);
            // timers= {};
        };
    }

    this.pause = function(){
        if(this.game.state!=this.game.states["RUNNING"]){
            this.game.start();
        }
        else if(!this.game.PAUSED)
            this.game.pause();
        else
            this.game.run();
    }

    this.set = function(key, fn){
        this[key] = fn;
    };
}