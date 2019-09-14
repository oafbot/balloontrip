Sound = function(){
    this.audio = [];

    this.play = function(name){
        this.audio[name].play();
    }

    this.stop = function(name){
        this.audio[name].pause();
        this.audio[name].currentTime = 0;
    };

    this.new = function(name, src){
        this.audio[name] = new Audio(src);
    }

    this.pause = function(name){
        this.audio[name].pause();
    }
}