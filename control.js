function Controller(game){
    var KEY_INTERVAL = 250,
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
        "X"          : 65,  // a
        "Y"          : 83,  // s
        "L1"         : 81,  // q
        "L2"         : 69,  // e
        "R1"         : 87,  // w
        "R2"         : 82,  // r
        "MUSIC"      : 77,  // m
        "CANCEL"     : 191, // slash
        "SELECT"     : 16,  // shift
        // "LEFT_ALT"   : 65,  // a
        // "RIGHT_ALT"  : 68,  // d
        // "UP_ALT"     : 87,  // w
        // "DOWN_ALT"   : 83,  // s
    };

    gamepad.listen = function(){
        window.addEventListener("gamepadconnected", function(e) {
            console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
            e.gamepad.index, e.gamepad.id,
            e.gamepad.buttons.length, e.gamepad.axes.length);
            gamepad.id = e.gamepad.index;
            gamepad.connected = true;
            window.GAMEPAD_ID = gamepad.id;
            self.gamepadInput();
        });
    };

    gamepad.destroy = function(){
        console.log("gamepad disconnected");
        window.GAMEPAD_ID = undefined;
        gamepad.id = undefined;
        gamepad.connected = false;
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
        R1: false,
        R2: false,
        PAUSE: false,
        SELECT: false
    };

    this.frozen = {
        pause  : false,
        select : false
    };

    this.left   = function(){ console.log("left");   };
    this.up     = function(){ console.log("up");     };
    this.right  = function(){ console.log("right");  };
    this.down   = function(){ console.log("down");   };
    this.a      = function(){ console.log("A");      };
    this.b      = function(){ console.log("B");      };
    this.x      = function(){ console.log("X");      };
    this.y      = function(){ console.log("Y");      };
    this.r1     = function(){ console.log("R1");     };
    this.l1     = function(){ console.log("L1");     };
    this.r2     = function(){ console.log("R1");     };
    this.l2     = function(){ console.log("L1");     };
    this.select = function(){ console.log("select"); };

    this.pressed = function(key){
        if(gamepad.connected && self.gamebutton[key])
            return true;
        if(Object.keys(self.keypress).indexOf(String(keys[key]))>=0)
            return true;
        return false;
    };

    this.init = function(direction){
        var opts = {};
        opts[keys.PAUSE]  = function(event){ self.pause(event); };
        opts[keys.SELECT] = function(event){ self.select(event); };
        opts[keys.LEFT]   = function(event){ if((!lock && !self.game.PAUSED) || self.game.state==0) self.left(event);  };
        opts[keys.UP]     = function(event){ if((!lock && !self.game.PAUSED) || self.game.state==0) self.up(event);    };
        opts[keys.RIGHT]  = function(event){ if((!lock && !self.game.PAUSED) || self.game.state==0) self.right(event); };
        opts[keys.DOWN]   = function(event){ if((!lock && !self.game.PAUSED) || self.game.state==0) self.down(event);  };
        opts[keys.A]      = function(event){ if((!lock && !self.game.PAUSED) || self.game.state==0) self.a(event)      };
        opts[keys.B]      = function(event){ if((!lock && !self.game.PAUSED) || self.game.state==0) self.b(event)      };
        opts[keys.X]      = function(event){ if((!lock && !self.game.PAUSED) || self.game.state==0) self.x(event)      };
        opts[keys.Y]      = function(event){ if((!lock && !self.game.PAUSED) || self.game.state==0) self.y(event)      };
        opts[keys.R1]     = function(event){ if((!lock && !self.game.PAUSED) || self.game.state==0) self.r1(event)     };
        opts[keys.L1]     = function(event){ if((!lock && !self.game.PAUSED) || self.game.state==0) self.l1(event)     };
        // opts[keys.LEFT_ALT]  = function(event){ if(!lock && !self.game.PAUSED) self.left(event);  };
        // opts[keys.UP_ALT]    = function(event){ if(!lock && !self.game.PAUSED) self.up(event);    };
        // opts[keys.RIGHT_ALT] = function(event){ if(!lock && !self.game.PAUSED) self.right(event); };
        // opts[keys.DOWN_ALT]  = function(event){ if(!lock && !self.game.PAUSED) self.down(event);  };

        game.controls = this;
        this.direction = direction;

        this.keyboard(opts, KEY_INTERVAL);

        if(window.GAMEPAD_ID===undefined){
            gamepad.listen();
            window.addEventListener("gamepaddisconnected", gamepad.destroy, false);
        }
        else{
            gamepad.id = window.GAMEPAD_ID;
            gamepad.connected = true;
            this.gamepadInput();
        }
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
    };

    function buttonPressed(button) {
        if (typeof(button) == "object") {
            return button.pressed;
        }
        return button == 1.0;
    }

    function buttonsPressed(axes, buttons){
        self.gamebutton.RIGHT = Math.floor(axes[0])>0;
        self.gamebutton.LEFT  = Math.floor(axes[0])<0;
        self.gamebutton.DOWN  = Math.floor(axes[1])>0;
        self.gamebutton.UP    = Math.floor(axes[1])<0;

        self.gamebutton.A  = buttonPressed(buttons[1]);
        self.gamebutton.B  = buttonPressed(buttons[0]);
        self.gamebutton.X  = buttonPressed(buttons[3]);
        self.gamebutton.Y  = buttonPressed(buttons[2]);
        self.gamebutton.R1 = buttonPressed(buttons[5]);
        self.gamebutton.L1 = buttonPressed(buttons[4]);
        self.gamebutton.R2 = buttonPressed(buttons[7]);
        self.gamebutton.L2 = buttonPressed(buttons[6]);

        self.gamebutton.PAUSE  = buttonPressed(buttons[9]);
        self.gamebutton.SELECT = buttonPressed(buttons[8]);
        return self.gamebutton;
    }

    this.gamepadInput = function GamePadController(){
        self.pad = navigator.getGamepads()[gamepad.id];
        buttonsPressed(self.pad.axes, self.pad.buttons);

        if(self.gamebutton.A){
            if((!lock && !self.game.PAUSED) || self.game.state==0) self.a();
        }
        if (self.gamebutton.B) {
            if((!lock && !self.game.PAUSED) || self.game.state==0) self.b();
        }
        if(self.gamebutton.X){
            if((!lock && !self.game.PAUSED) || self.game.state==0) self.x();
        }
        if(self.gamebutton.Y){
            if((!lock && !self.game.PAUSED) || self.game.state==0) self.y();
        }
        if(self.gamebutton.L1){
            if((!lock && !self.game.PAUSED) || self.game.state==0) self.l1();
        }
        if(self.gamebutton.R1){
            if((!lock && !self.game.PAUSED) || self.game.state==0) self.r1();
        }
        if(self.gamebutton.L2){
            if((!lock && !self.game.PAUSED) || self.game.state==0) self.l2();
        }
        if(self.gamebutton.R2){
            if((!lock && !self.game.PAUSED) || self.game.state==0) self.r2();
        }
        if(self.gamebutton.SELECT){
            if(!self.frozen.pause){
                self.select();
                self.freeze("select");
                self.gamebutton.SELECT = false;
                setTimeout(function(){self.unfreeze("select");}, KEY_INTERVAL*2);
            }
        }
        if(self.gamebutton.PAUSE){
            if(!self.frozen.pause){
                self.pause();
                self.freeze("pause");
                self.gamebutton.PAUSE = false;
                setTimeout(function(){self.unfreeze("pause");}, KEY_INTERVAL*2);
            }
        }

        if(self.gamebutton.RIGHT) {
            if((!lock && !self.game.PAUSED) || self.game.state==0) self.right();
        }
        if(self.gamebutton.DOWN) {
            if((!lock && !self.game.PAUSED) || self.game.state==0) self.down();
        }
        if(self.gamebutton.LEFT) {
            if((!lock && !self.game.PAUSED) || self.game.state==0) self.left();
        }
        if(self.gamebutton.UP) {
            if((!lock && !self.game.PAUSED) || self.game.state==0) self.up();
        }

        requestAnimationFrame(function(){
            setTimeout(self.gamepadInput, KEY_INTERVAL);
        });
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

    this.freeze = function(button){
        this.frozen[button] = true;
    };

    this.unfreeze = function(button){
        this.frozen[button] = false;
    }
}