function Physics(game){
    var self = this;

    this.gravity = function(sprite, factor, ground) {
        if(factor===undefined)
            factor = 1;

        return new (function(){
            // this.type = type;
            this.x = sprite.x();
            this.y = sprite.y();
            this.gravity = 0.98*factor;

            this.update = function() {
                if(!game.PAUSED){
                    this.speedG += this.gravity;
                    if(ground===undefined || sprite.cy()<ground-2*(sprite.bbox().height))
                        sprite.animate(100).dmove(this.momentum, this.speedG);
                    else sprite.move(sprite.x(), sprite.y());
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

            this.reset();
        })()
    }

    this.accelerate = function(sprite, inc){
        if(this.momentum < this.topspeed)
            this.momentum += 10;
    }
}