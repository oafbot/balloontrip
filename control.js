function Controller(game){
    var KEY_INTERVAL = 300,
    self = this,
    lock = false,

    keys  = {
        "LEFT"       : 37,  // ←
        "UP"         : 38,  // ↑
        "RIGHT"      : 39,  // →
        "DOWN"       : 40,  // ↓
        "PAUSE"      : 32,  // space
        "A"          : 90,  // z
        "B"          : 88,  // x
        "MUSIC"      : 77,  // m
        "CANCEL"     : 191, // slash
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
        opts[keys.PAUSE]     = function(event){ self.pause(event); };
        opts[keys.LEFT]      = function(event){ if(!lock && !self.game.PAUSED) self.left(event);  };
        opts[keys.UP]        = function(event){ if(!lock && !self.game.PAUSED) self.up(event);    };
        opts[keys.RIGHT]     = function(event){ if(!lock && !self.game.PAUSED) self.right(event); };
        opts[keys.DOWN]      = function(event){ if(!lock && !self.game.PAUSED) self.down(event);  };
        opts[keys.A]         = function(event){ if(!lock && !self.game.PAUSED) self.a(event)      };
        opts[keys.B]         = function(event){ if(!lock && !self.game.PAUSED) self.b(event)      };
        opts[keys.LEFT_ALT]  = function(event){ if(!lock && !self.game.PAUSED) self.left(event);  };
        opts[keys.UP_ALT]    = function(event){ if(!lock && !self.game.PAUSED) self.up(event);    };
        opts[keys.RIGHT_ALT] = function(event){ if(!lock && !self.game.PAUSED) self.right(event); };
        opts[keys.DOWN_ALT]  = function(event){ if(!lock && !self.game.PAUSED) self.down(event);  };
        this.keyboard(opts, KEY_INTERVAL);
        game.controls = this;
        this.direction = direction;
    };

    this.keyboard = function KeyboardController(keys, repeat){
        /* Lookup of key codes to timer ID, or null for no repeat */
        var timers= {};
        self.keypress = timers;

        var keyOn = function(event){
            var key= (event || window.event).keyCode;
            if (!(key in keys))
                return true;

            if (!(key in timers)){
                timers[key] = null;
                keys[key](event);
                if (repeat!==0)
                    requestAnimationFrame(keyOn.bind(this, event));
            }
            return false;
        };

        /**
        * When key is pressed and we don't already think it's pressed, call the
        * key action callback and set a timer to generate another one after a delay
        */
        document.onkeydown = function(event) {
            keyOn(event);
        };

        /* Cancel timeout and mark key as released on keyup */
        document.onkeyup = function(event) {
            var key = (event || window.event).keyCode;
            if (key in timers)
                requestAnimationFrame(function(){delete timers[key];});
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

    this.pause = function(event){
        if(this.game.state!=this.game.states["RUNNING"])
            this.game.start();
        else if(!this.game.PAUSED && !lock)
            this.game.pause();
        else
            this.game.run();
    }

    this.set = function(key, fn){
        this[key] = fn;
    };

    this.lock = function(){
        lock = true;
    }

    this.unlock = function(){
        lock = false;
    }
}