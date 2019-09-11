function Game(){
    var self = this,
        KEYFRAME = 8;

    this.counter = 0;
    this.frame = 0;

    this.queue = {update:[], tween:[]};
    this.bounds = {top:0, bottom:undefined, right:undefined, left:0};

    this.update = function(){
        for(var i=0, l=this.queue.update.length; i<l; i++){
            this.queue.update[i]();
        }
    };

    this.tween = function(){
        for(var i=0, l=this.queue.tween.length; i<l; i++){
            this.queue.tween[i]();
        }
    }

    this.add = function(fn, key){
        this.queue[key].push(fn);
    }

    this.loop = function(){
        if(!self.PAUSED){
            if(self.counter%KEYFRAME===0){
                self.update();
                self.frame = self.frame < 3 ? self.frame + 1 : 0;
            }else{
                self.tween();
            }
            self.counter++;
            requestAnimationFrame(self.loop);
        }
    };

    this.run = function(){
        this.PAUSED = false;
        requestAnimationFrame(this.loop);
        console.log("running.")
    };

    this.pause = function(){
        this.PAUSED = true;
        console.log("paused.");
    }

    this.init = function(options){
        keys = Object.keys(options);
        for(var key in options){
            self[key] = options[key];
        }
    }
}