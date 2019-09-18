function Sprite(game, palette, dim, pix){
    var loc = [0, 0];

    this.frames = [];
    this.game = game;
    this.box = game.screen.group();
    this.sprite = this.box;
    this.dim = dim;
    this.pix = pix;
    this.palette = palette;
    this.frame = 0;

    // this.init = function(){}

    this.draw = function(bitmap, offset, cols){
        var q, ql, i, l, row, mod,

        cols = cols===undefined ? 2 : cols,
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
                default:
                    loc[0] = (dim * pix) * (q%cols);
                    loc[1] = (dim * pix) * (q-(q%4)-2);
            }

            for(i=0, l=bitmap[q].length; i<l; i++){
                row = parseInt(i/dim);
                mod = i%dim;

                if(palette[bitmap[q][i]]!==null)
                    frame.rect(pix, pix).move(offset.x + loc[0] + pix*mod, offset.y + loc[1] + row*pix).fill(palette[bitmap[q][i]]);
            }
        }
        frame.attr('class', 'bitmap')
        return frame;
    }

    this.animate = function(f, fn){
        for(var i=0, l=this.frames.length; i<l; i++){
            if(i===f)
                this.frames[i].opacity(1);
            else
                this.frames[i].opacity(0);
        }
        if(fn!==undefined)
            fn(f);
    }

    this.group = function(sprite1, sprite2){
        var group = game.screen.group();
        group.add(sprite1);
        group.add(sprite2);
        return group;
    }

    this.add = function(){
        var group = this.box;
        for(var i=0, l=arguments.length; i<l; i++){
            group.add(arguments[i]);
            this.frames.push(arguments[i]);
        }
        return this;
    }

    this.move = function(x, y){
        this.box.dmove(x, y);
    };

    this.position = function(){
        return {x: this.box.cx(), y:this.box.cy()}
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
            game.cast[name] = [s];

        return s;
    };

    this.bitmask = function(){
        return {
            x0: this.box.x()+pix,
            x1: this.box.x() + this.box.bbox().width - pix,
            y0: this.box.y()+pix,
            y1: this.box.y() + this.box.bbox().height-pix
        }
    };

    this.collision = function(obj){
        var a = this.bitmask();
        var b = obj.bitmask();
        return !( a.x1 < b.x0 || a.x0 > b.x1 || a.y0 > b.y1 || a.y1 < b.y0 )
    };
}