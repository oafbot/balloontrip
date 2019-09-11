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
                    if(ground===undefined || sprite.cy() < ground - sprite.bbox().height){
                        sprite.animate(100).dmove(sign*self.momentum, this.speedG);
                        this.grounded = false;
                    }
                    else{
                        sprite.move(sprite.x(), sprite.y());
                        this.grounded = true;
                    }
                    this.lift = 0;
                    // this.position();
                }
            }

            this.position = function() {
                this.speedG += this.gravity;
                this.x += this.speedX;
                this.y += this.speedG;
            }

            this.reset = function(){
                this.speedX = 0;
                this.speedY = 0;
                this.speedG = 0;
                this.x = sprite.x();
                this.y = sprite.y();
            }

            this.float = function(){
                this.lift -= this.bouyancy;
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
}