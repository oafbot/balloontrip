function Physics(game){
    var self = this;

    this.momentum = 0;

    this.gravity = function(sprite, factor, ground) {
        if(factor===undefined)
            factor = 1;

        return new (function(){
            this.x = sprite.x();
            this.y = sprite.y();
            this.lift = 0;
            this.gravity  = 0.98*factor;
            this.bouyancy = 0.098*factor;
            this.grounded = false;

            this.update = function() {
                if(!game.PAUSED){
                    this.speedG += this.gravity;
                    var sign = game.controls.direction == "left" ? -1 : 1;
                    var speed = sprite.cx() > game.bounds.left && sprite.cx() < game.bounds.right ? sign*self.momentum : 0;

                    if(ground===undefined || sprite.cy() < ground - sprite.bbox().height){
                        sprite.animate(100).dmove(speed, this.speedG);
                        this.grounded = false;
                    }
                    else{
                        sprite.move(sprite.x(), sprite.y());
                        this.grounded = true;
                    }
                    this.lift = 0;
                }
            }

            this.reset = function(){
                this.speedG = 0;
                this.x = sprite.x();
                this.y = sprite.y();
            }

            this.float = function(){
                this.lift -= this.bouyancy;
                this.reset();
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
    }
    this.decelerate = function(dec){
        if(this.momentum > this.basespeed)
            this.momentum -= dec;
    }
}