function Physics(game){
    var self = this;

    this.momentum = 0;
    this.vector = {
        speed : 0,
        direction : 0,
        bouncing : false
    }

    this.gravity = function(sprite, factor, ground) {
        if(factor===undefined)
            factor = 1;

        if(ground===undefined)
            ground = game.bounds.bottom

        return new (function(){
            this.x = sprite.x();
            this.y = sprite.y();
            this.lift = 0;
            this.gravity  = 0.98*factor;
            this.buoyancy = 0.098*factor;
            this.grounded = false;
            this.delay = 0;

            this.update = function() {
                // console.log(this.delay)
                if(!game.PAUSED && this.delay===0){
                    this.speedG += this.gravity;
                    var sign = game.controls.direction == "left" ? -1 : 1;
                    var speed = sprite.cx() > game.bounds.left && sprite.cx() < game.bounds.right ? sign*this.momentum : 0;

                    if(ground===undefined || sprite.cy() < ground - sprite.bbox().height/2){
                        sprite.dmove(speed, this.speedG);
                        this.grounded = false;
                    }
                    else{
                        sprite.move(sprite.x(), sprite.y());
                        this.grounded = true;
                    }
                    this.lift = 0;
                }
                else{
                    this.float(this.delay);
                }
            }

            this.reset = function(){
                this.speedG = 0;
                this.x = sprite.x();
                this.y = sprite.y();
            }

            this.unfloat = function(){
                this.delay = 0;
                this.speedG = this.lift;
            };

            this.float = function(delay){
                this.lift -= this.buoyancy;
                this.speedG -= this.buoyancy;
                this.delay = delay!==undefined ? delay : 0;
                sprite.dmove(this.momentum, this.lift);
                setTimeout(this.unfloat.bind(this), this.delay);
                // this.reset();
            }

            this.reset();
        })()
    }

    this.speedRange = function(lo, hi){
        this.topspeed  = hi;
        this.basespeed = lo;
    }

    this.accelerate = function(inc){
        if(Math.abs(this.momentum) < this.topspeed)
            this.momentum += inc;
        this.vector.speed = this.momentum;
    }
    this.decelerate = function(dec){
        if(this.momentum > this.basespeed)
            this.momentum -= dec;
        this.vector.speed = this.momentum;
    }

    this.deflect = function(sprite){
        switch(this.vector.direction){
            case "N":
                this.vector.direction = "S";
                this.vector.bouncing = true;
                sprite.animate(100).dmove(0, sprite.bbox().height);
                break;
            case "NE":
                this.vector.direction = "SE";
                this.vector.bouncing = true;
                sprite.animate(100).dmove(this.momentum, sprite.bbox().height);
                break;
            case "E":
                this.vector.direction = "W";
                this.vector.bouncing = true;
                sprite.animate(100).dmove(-this.momentum, -sprite.bbox().width);
                break;
            case "SE":
                this.vector.direction = "NE";
                this.vector.bouncing = true;
                sprite.animate(100).dmove(this.momentum, -sprite.bbox().height);
                break;
            case "S":
                this.vector.direction = "N";
                this.vector.bouncing = true;
                sprite.animate(100).dmove(0, -sprite.bbox().height);
                break;
            case "SW":
                this.vector.direction = "NW";
                this.vector.bouncing = true;
                sprite.animate(100).dmove(-this.momentum, -sprite.bbox().height);
                break;
            case "W":
                this.vector.direction = "E";
                this.vector.bouncing = true;
                sprite.animate(100).dmove(this.momentum, sprite.bbox().width);
                break;
            case "NW":
                this.vector.direction = "SW";
                this.vector.bouncing = true;
                sprite.animate(100).dmove(-this.momentum, sprite.bbox().height);
                break;
        }
        // console.log(this.vector);
        setTimeout(function(){self.vector.bouncing = false;}, 200);
    };
}