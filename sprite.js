function Sprite(game, palette, dim, pix){
    var loc = [0, 0];

    this.frames = [];
    this.game = game;
    this.box = game.screen.group();
    this.sprite = this.box;
    this.dim = dim;
    this.pix = pix;
    this.palette = palette;

    this.init = function(){
        
    }

    this.draw = function(bitmap, offset){
        var q, ql, i, l, row, mod,

        frame = game.screen.group();

        offset = offset === undefined ? {x : 0, y : 0} : offset;

        for(q=0, ql=bitmap.length; q<ql; q++){
            switch(q){
                case 0:
                    loc = [0, 0];
                    break;
                case 1:
                    loc[0] = dim*pix;
                    loc[1] = 0;
                    break;
                case 2:
                    loc[0] = 0;
                    loc[1] = dim * pix;
                    break;
                case 3:
                    loc[0] = dim * pix;
                    loc[1] = dim * pix;
                    break;
            }

            for(i=0, l=bitmap[q].length; i<l; i++){
                row = parseInt(i/dim);
                mod = i%dim;

                if(palette[bitmap[q][i]]!==null)
                    frame.rect(pix, pix).move(offset.x + loc[0] + pix*mod, offset.y + loc[1] + row*pix).fill(palette[bitmap[q][i]]);
            }
        }
        return frame;
    }

    this.animate = function(f){
        for(var i=0, l=this.frames.length; i<l; i++){
            if(i===f)
                this.frames[i].opacity(1);
            else
                this.frames[i].opacity(0);
        }
    }

    this.group = function(sprite1, sprite2){
        var group = game.screen.group();
        group.add(sprite1);
        group.add(sprite2);
        return group;
        // return sprite1.bbox().merge(sprite2.bbox());
    }

    this.add = function(){
        var group = this.box;
        for(var i=0, l=arguments.length; i<l; i++){
            group.add(arguments[i]);
            this.frames.push(arguments[i]);
        }
        return this;
        // return {
        //     sprite : group,
        //     position : function(){ return {x: group.cx(), y: group.cy()} },
        //     move : function(x, y){ group.dmove(x, y); },
        //     object : this
        // };
    }

    this.move = function(x, y){
        this.box.dmove(x, y);
    };

    this.position = function(){
        return {x: this.box.cx(), y:this.box.cy()}
    };

    this.clone = function(){
        var c = Object.assign(new Sprite(game, palette, dim, pix), this);
        c.box = game.screen.group();
        c.sprite = c.box;
        for(var i=0, l=this.frames.length; i<l; i++){
            c.frames[i] = this.frames[i].clone();
            c.box.add(c.frames[i]);
        }
        return c;
    };

    this.factory = function(name, bitmaps){
        var i, l, j, m
        frames = [],
        s = new Sprite(this.game, this.palette, this.dim, this.pix);

        for(i=0, l=bitmaps.length; i<l; i++){
            var group = game.screen.group();
            for(j=0, m=bitmaps[i].length; j<m; j++){
                group.add(s.draw(bitmaps[i][j][0], bitmaps[i][j][1]));
            }
            frames.push(group)
        }

        s.add(...frames);

        for(i=0, l=s.frames.length; i<l; i++)
            if(i!==0) s.frames[i].opacity(0);

        if(game.cast.hasOwnProperty(name))
            game.cast[name].push(s);
        else
            game.cast[name] = [];

        return s;
    };
}