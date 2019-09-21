Sound = function(game){
    const MUSIC_VOL  = 0.5;
    const EFFECT_VOL = 1.0;

    var self = this,
        Mixer,
        Feed,
        Audio,
        AudioContext = window.AudioContext || window.webkitAudioContext,
        context = new AudioContext();

    game.sound = this;

    this.context = context;
    this.out = context.destination;
    this.loading = false;

    Mixer = function(context){
        this.convolver = { channel : [context.createConvolver(), context.createConvolver()] };
    };

    this.mixer = new Mixer(context);

    Feed = function(input){
        var feed,
            output,
            endpoint = input.length-1;

        feed = {};
        Object.setPrototypeOf(feed, Feed.prototype);

        feed.nodes = input;
        feed.in    = input[0];
        feed.out   = input[0];

        for(var i=endpoint; i>0; --i)
            feed.out = input[i].connect(input[i+1]);

        return feed;
    };
    Feed.prototype = Object.create({ in : undefined, out : undefined });

    Audio = function(name){
        var sound = context.createBufferSource();
        var gain  = context.createGain();

        Object.setPrototypeOf(sound, Audio.prototype);
        sound.connect(gain);

        sound.name   = name;
        sound.buffer = null;
        sound.timer  = { start : new Date(), loaded : 0, offset : 0, play : 0 };
        sound.out    = gain;
        sound.loop   = false;
        sound.gain   = gain;

        /*
        sound.load = function(file, onload){
            var request = new XMLHttpRequest();

            request.open("GET", file, true);
            request.responseType = "arraybuffer";

            request.onload = function(){
                var success = function(buffer){
                    if(!buffer){ console.error('error decoding file data: ' + url); return; }
                    sound.init(buffer);
                    onload(buffer);
                };

                var fail = function(error){ console.error('decodeAudioData error', error); };

                self.context.decodeAudioData( request.response, success, fail );
            };

            request.onerror = function(){ console.error('BufferLoader: XHR error'); };
            request.send();
        };
        */

        sound.init = function(buffer){
            this.buffer = buffer;

            this.timer.loaded = new Date();
            this.timer.offset = (this.timer.loaded - this.timer.start) / 1000;

            this.playing = game.util.dynamic(this, 'playing',
                function(){ return (this.time>0 && this.time<=this.buffer.duration) || (this.loop && !this.paused); }
            );

            this.volume = game.util.dynamic(this, 'volume',
                function(){ return gain.gain.value; },
                function(level){
                    if(level===undefined) level = this.loop ? 0.5 : 1;
                    gain.gain.setTargetAtTime(level, context.currentTime, 0.01 );
                }
            );

            // gain.gain.setTargetAtTime(this.volume, context.currentTime, 0.01 );
            return this;
        };

        sound.bypass = function(){
            this.disconnect();
            this.connect(gain);
            this.out = gain;
            return this.out;
        };

        sound.route = function(feed){
            this.connect(feed.out);
            feed.out.connect(gain);
            this.out = gain;
            return this.out;
        };

        sound.reset = function(){
            this.disconnect();
            this.out.disconnect();
            var reset = new Audio(this.name);
            return reset.init(this.buffer);
        };

        sound.play = function(when, offset, duration){
            if(this.paused===undefined || this.paused<0)
                this.paused = 0;
            else if(offset<0)
                offset = 0;

            try{
                if(!this.playing){
                    this.timer.play = Date.now();
                    this.start(when || 0, this.paused || offset, duration);
                    this.paused = undefined;
                    // console.log(sound.volume )
                }
                else{
                    this.timer.play = Date.now();
                    this.start(0, offset, duration);
                    this.paused = undefined;
                    // sound.stop();
                    // sound.out.connect(gain);
                }
            }
            catch(error){
                // Note: InvalidStateError will be raised on repeated calls to the sound.
                // console.log(error);
            }
        };

        sound.pause = function(){
            if(this instanceof AudioBufferSourceNode){
                time = context.currentTime - sound.timer.offset;
                time = time<this.buffer.duration ? time : time % sound.buffer.duration;
                try {
                    if(this.paused===undefined){
                        this.stop();
                        sound = this.reset();
                        sound.paused = time;
                        sound.playing = false;
                        return sound;
                    }
                }
                catch(error){
                    console.log(error);
                }
            }
        };

        return sound;
    };
    Audio.prototype = Object.create(AudioBufferSourceNode.prototype);
    Audio.prototype.timer = { start : Date.now(), loaded : Date.now(), offset : 0, play : Date.now() };
    Audio.prototype.time = game.util.dynamic(Audio.prototype, 'time', function(){return (Date.now() - this.timer.play)/1000;});

    this.loaded  = [];
    this.reverbs = [];
    this.format;
    // this.bypass = false;

    this.audio = {};
    this.BGM   = undefined;

    this.effects = { apply : true, data : []};
    this.files = [];
    this.complete = false;

    this.onload = function(onload){
        if(!this.complete){
            game.events.listen('sound.loaded', 'sound.loadcomplete', game, onload);
            this.complete = false;
        }
    };

    this.loadcomplete = function(onload){
        if(!this.complete){
            game.events.remove('sound.loaded', 'sound.loadcomplete');
            this.complete = true;
            onload();
        }
    };

    this.loadBuffer = function(url, onload) {
        var request = new XMLHttpRequest();

        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        request.onload = function(){
            var success = function(buffer){
                if(!buffer){ console.error('error decoding file data: ' + url); return; }
                onload(buffer);
            };

            var fail = function(error){ console.error('decodeAudioData error', error); };

            self.context.decodeAudioData( request.response, success, fail );
        };

        request.onerror = function(){ console.error('BufferLoader: XHR error'); };
        request.send();
    };

    this.supportedFormat = function(audio){
        if(this.format!==undefined)
            return this.format;
        if( audio.canPlayType("audio/ogg") == "probably" ||
            audio.canPlayType("audio/ogg") == "maybe" )
            return ".ogg";
        else if( audio.canPlayType("audio/wav") == "probably" ||
                 audio.canPlayType("audio/wav") == "maybe" )
            return ".wav";
        else if( audio.canPlayType("audio/aac") == "probably" ||
                 audio.canPlayType("audio/aac") == "maybe" )
            return ".m4a";
        else if( audio.canPlayType("audio/mp4") == "probably" ||
                 audio.canPlayType("audio/mp4") == "maybe" )
            return ".mp4";
        else if( audio.canPlayType("audio/mp3") == "probably" ||
                 audio.canPlayType("audio/mp3") == "maybe" )
            return ".mp3";
        else
            return ".wav";
        return this.format;
    };

    this.audioLoaded = function(audio){
        self.loaded.push(audio);

        if(self.loaded.length===self.files.length){
            game.events.dispatch('sound.loaded');
            self.loading = false;
        }
        else{
            self.loading = true;
        }
    };

    this.allocate = function(src, name){
        this.audio[name] = new Audio(name);

        onload = function(buffer){
            self.audioLoaded(name);
            self.audio[name].init(buffer);
        };

        this.loadBuffer(src, onload);
    };

    this.init = function(files){
        if(this.files.length<1){
            this.files = files;
            // this.check  = document.createElement('audio');
            // this.format = this.supportedFormat(this.check);
            // delete this.check;
            for(var i=0, n=this.files.length; i<n; i++)
                this.allocate(this.files[i].src, this.files[i].name);
        }
        else{
            this.complete = true;
            this.loading = false;
        }
    };

    this.effect = {};
    this.effect.apply = function(audio){
        var apply = self.type.UI.filter(function(sound){return sound.name==audio.name;}).length===0;
        return apply && self.effects.apply;
    };
    this.effect.create = function(effect, audio){
        var fx, sound;
        switch(effect.type){
            case "convolver":
                try{
                    self.mixer.convolver.channel[0] = context.createConvolver();
                    self.mixer.convolver.channel[1] = context.createConvolver();

                    fx = self.BGM===audio ? self.mixer.convolver.channel[0] : self.mixer.convolver.channel[1];

                    if(fx.buffer===null)
                        fx.buffer = self.audio[effect.name].buffer;

                    self.audio[effect.name].onended = function(){
                        self.audio[effect.name] = self.audio[effect.name].reset();
                    };
                }
                catch(e){
                    console.error(e);
                }
                break;
            case "filter":
                break;
        }
        return fx;
    };

    this.connect = function(audio){
        // if( this.effect.apply(audio) )
            // self.route(audio);
        audio.out.connect(self.out);
    };

    this.route = function(audio, effect){
        var feed,
            routing = [],
            fx = self.GetEffect();

        if(fx.length){
            for(var i=0, n=fx.length; i<n; i++)
                routing.push(self.effect.create(fx[i], audio));
            feed = new Feed(routing);
            audio.route(feed);
        }
    };

    this.bypass = function(audio){
        audio.bypass().connect(self.out);
    };

    this.ended = function(name, volume, cb){
        self.audio[name] = self.audio[name].reset();
        game.events.dispatch('sound.end'/* + name*/);
        if(cb!==undefined && game.util.isfunc(cb)) cb();
    };

    var play = function(sound){
        try{
            self.connect(sound);
            sound.play();
        }catch(e){
            if(e.name!="InvalidStateError" && e.name!="TypeError"){
                console.log(error);
                // setTimeout(play.bind(self, sound), 100);
            }
            else console.log(e);
        }
    };

    this.play = function(snd, vol, cb){
        var sound = typeof snd==='string' ? this.audio[snd] : snd;
        // sound.disconnect();
        sound.volume  = typeof vol!='undefined' ? vol : EFFECT_VOL;
        sound.loop    = false;
        sound.onended = self.ended.bind(self, sound.name, vol, cb);
        play(sound);
    };

    this.loop = function(snd, volume){
        var sound = typeof snd==='string' ? this.audio[snd] : snd;
        sound.loop = true;
        sound.volume = typeof volume!=='undefined' ? volume : MUSIC_VOL;
        play(sound);
        // this.BGM = sound;
        // sound.onended = self.ended.bind(self, sound.name, volume/*, this.loop.bind(this, snd, volume)*/);
        // game.events.listen('sound.end.'+snd, 'sound.replay', game, snd, volume);
    };

    this.stop = function(snd){
        var sound = typeof snd==='string' ? this.audio[snd] : snd;
        if(sound!==undefined){
            // console.log(snd, sound.playing, sound.time)
            if(sound.playing/* || (sound.loop && !sound.paused)*/){
                sound.pause();
                sound.disconnect();
                this.audio[sound.name] = sound.reset();
                this.audio[sound.name].paused = undefined;
            }
        }
    };

    this.pause = function(snd){
        var sound = typeof snd==='string' ? this.audio[snd] : snd;
        if(sound!==undefined){
            if(sound.playing/* || (sound.loop && !sound.paused)*/){
                sound.pause();
                this.audio[sound.name] = sound.reset();
                this.audio[sound.name].paused = sound.time;
            }
        }
    }

    this.replay = function(snd, volume){
        var sound = typeof snd==='string' ? this.audio[snd] : snd;
        if(game.audio.on)
            this.loop(snd, volume);
    };

    this.repeat = function(snd, times, volume){
        game.events.remove('sound.end', 'sound.repeat');

        if(times>0){
            this.play(snd, volume);
            times = times>0 ? times-1 : 0;
            game.events.listen('sound.end', 'sound.repeat', null, snd, times, volume);
        }
        else{
            game.events.remove('sound.end', 'sound.repeat');
        }
    };
};