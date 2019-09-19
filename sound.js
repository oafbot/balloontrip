const AudioContext = window.AudioContext || window.webkitAudioContext;

Sound = function(){
    const context = new AudioContext();
    this.audio = [];

    this.play = function(name, vol){
        if(vol!==undefined)
            this.audio[name].volume = vol;
        this.audio[name].play();
    }

    this.playloop = function(name, vol){
        this.audio[name].loop = true;
        this.play(name, vol);
    }

    this.stop = function(name){
        this.audio[name].pause();
        this.audio[name].currentTime = 0;
    };

    this.new = function(name, src){
        sound = context.createBufferSource();
        this.audio[name] = new Audio(src);
    }

    this.pause = function(name){
        this.audio[name].pause();
    }
}