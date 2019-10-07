function Controller(game){
    var KEY_INTERVAL = 300,
    self = this,
    lock = false,
    gamepad = {
        id : undefined,
        connected : false
    },
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
    this.gamebutton = {
        UP: false,
        DOWN: false,
        RIGHT: false,
        LEFT: false,
        A: false,
        B: false,
        X: false,
        Y: false,
        L1: false,
        L2: false,
        PAUSE: false,
        SELECT: false
    };

    this.left  = function(){};
    this.up    = function(){};
    this.right = function(){};
    this.down  = function(){};
    this.a     = function(){};
    this.b     = function(){};

    this.pressed = function(key){
        if(gamepad.connected && self.gamebutton[key])
            return true;
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

        game.controls = this;
        this.direction = direction;

        this.keyboard(opts, KEY_INTERVAL);

        if(window.GAMEPAD_ID===undefined){
            window.addEventListener("gamepadconnected", function(e) {
                console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
                e.gamepad.index, e.gamepad.id,
                e.gamepad.buttons.length, e.gamepad.axes.length);
                gamepad.id = e.gamepad.index;
                gamepad.connected = true;
                window.GAMEPAD_ID = gamepad.id;
                self.gamepadInput();
            });
        }
        else{
            gamepad.id = window.GAMEPAD_ID;
            gamepad.connected = true;
            this.gamepadInput();
        }
        // window.addEventListener("gamepaddisconnected", function(e) { console.log("disconnected"); }, false);
    };

    this.padinit = function(){
        window.addEventListener("gamepadconnected", function(e) {
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
            e.gamepad.index, e.gamepad.id,
            e.gamepad.buttons.length, e.gamepad.axes.length);
            gamepad.id = e.gamepad.index;
            self.gamepadInput();
        });
    }

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
    };

    function buttonPressed(button) {
        if (typeof(button) == "object") {
            return button.pressed;
        }
        return button == 1.0;
    }

    function buttonsPressed(axes, buttons){
        // var pressed = {RIGHT:false, LEFT:false, UP:false, DOWN:false};
        self.gamebutton.RIGHT = Math.floor(axes[0])>0;
        self.gamebutton.LEFT  = Math.floor(axes[0])<0;
        self.gamebutton.DOWN  = Math.floor(axes[1])>0;
        self.gamebutton.UP    = Math.floor(axes[1])<0;

        self.gamebutton.A = buttonPressed(buttons[1]);
        self.gamebutton.B = buttonPressed(buttons[0]);
        self.gamebutton.X = buttonPressed(buttons[3]);
        self.gamebutton.Y = buttonPressed(buttons[2]);
        self.gamebutton.R1 = buttonPressed(buttons[5]);
        self.gamebutton.L1 = buttonPressed(buttons[4]);
        self.gamebutton.PAUSE  = buttonPressed(buttons[9]);
        self.gamebutton.SELECT = buttonPressed(buttons[8]);
        return self.gamebutton;
    }

    this.gamepadInput = function GamePadController(){
        self.pad = navigator.getGamepads()[gamepad.id];

        buttonsPressed(self.pad.axes, self.pad.buttons);

        if (self.gamebutton.B) {
            // console.log("B");
            if(!lock && !self.game.PAUSED) self.b();
        }
        if(self.gamebutton.A){
            // console.log("A");
            if(!lock && !self.game.PAUSED) self.a();
        }
        if(self.gamebutton.Y){
            // console.log("Y");
        }
        if(self.gamebutton.X){
            // console.log("X");
        }
        if(self.gamebutton.L1){
            // console.log("L1");
        }
        if(self.gamebutton.R1){
            // console.log("R1");
        }
        if(self.gamebutton.SELECT){
            // console.log("Select");
            self.gamebutton.SELECT = false;
        }
        if(self.gamebutton.PAUSE) {
            self.pause();
            self.gamebutton.PAUSE = false;
            console.log("Start");
        }

        if(self.gamebutton.RIGHT) {
            // console.log("right");
            if(!lock && !self.game.PAUSED) self.right();
        }
        if(self.gamebutton.DOWN) {
            // console.log("down");
            if(!lock && !self.game.PAUSED) self.down();
        }
        if(self.gamebutton.LEFT) {
            // console.log("left");
            if(!lock && !self.game.PAUSED) self.left();
        }
        if(self.gamebutton.UP) {
            if(!lock && !self.game.PAUSED) self.up();
            // console.log("up");
        }

        requestAnimationFrame(function(){
            setTimeout(self.gamepadInput, KEY_INTERVAL);
        });
        // setTimeout(function(){requestAnimationFrame(self.gamepadInput);}, KEY_INTERVAL);
        // console.log(game.delta, game.interval)
        // requestAnimationFrame( function(){ if(game.delta>game.interval) self.gamepadInput(); } );
    };

    this.pause = function(event){
        if(this.game.state!=this.game.states["RUNNING"])
            this.game.start();
        else if(!this.game.PAUSED && !lock)
            this.game.pause();
        else
            this.game.run();
    };

    this.set = function(key, fn){
        this[key] = fn;
    };

    this.lock = function(){
        lock = true;
    };

    this.unlock = function(){
        lock = false;
    };

    this.locked = function(){
        return lock;
    };
}