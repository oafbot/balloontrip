// const AudioContext = window.AudioContext || window.webkitAudioContext;
// const audioCtx = new AudioContext();

Sound = function(){
    this.audio = [];

    this.play = function(name, vol){
        if(vol!==undefined)
            this.audio[name].volume = vol;
        this.audio[name].play();
        // createjs.Sound.play(name);
    }

    this.playloop = function(name, vol){
        this.audio[name].loop = true;
        this.play(name, vol);
        // createjs.Sound.play(name);
    }

    this.stop = function(name){
        this.audio[name].pause();
        this.audio[name].currentTime = 0;
        // createjs.Sound.stop(name);
    };

    this.new = function(name, src){
        this.audio[name] = new Audio(src);
        // createjs.Sound.registerSound(src, name);
    }

    this.pause = function(name){
        this.audio[name].pause();
    }
}