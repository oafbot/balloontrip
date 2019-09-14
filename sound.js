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

    // var pulseOptions = {
    //     oscillator:{
    //       type: "pulse"
    //     },
    //     envelope:{
    //       release: 0.07
    //     }
    // };

    // var triangleOptions = {
    //     oscillator:{
    //         type: "triangle"
    //     },
    //     envelope:{
    //         release: 0.07
    //     }
    // };

    // var squareOptions = {
    //     oscillator:{
    //       type: "square"
    //     },
    //     envelope:{
    //       release: 0.07
    //     }
    // };

    // this.synth    = new Tone.Synth().toMaster()
    // this.pulse    = new Tone.Synth(pulseOptions).toMaster();
    // this.square   = new Tone.Synth(squareOptions).toMaster();
    // this.triangle = new Tone.Synth(triangleOptions).toMaster();
    // this.noise    = new Tone.NoiseSynth().toMaster();

    // function filterDots(value) {
    //   value = value.replace('1/32.', '1/32 + 1/64')
    //                .replace('1/16.', '1/16 + 1/32')
    //                .replace('1/8.', '1/8 + 1/16')
    //                .replace('1/4.', '1/4 + 1/8')
    //                .replace('1/2.', '1/2 + 1/4');

    //   return value;
    // };
}