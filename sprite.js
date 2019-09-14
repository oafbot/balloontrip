function Sprite(game, palette, dim, pix){
    var loc = [0, 0];

    this.frames = [];
    this.game = game;
    this.box = game.screen.group();
    this.sprite = this.box;
    this.dim = dim;
    this.pix = pix;
    this.palette = palette;

    // this.init = function(){
        
    // }

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
        frame.attr('class', 'bitmap')
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

    // this.clone = function(){
    //     var c = Object.assign(new Sprite(game, palette, dim, pix), this);
    //     c.box = game.screen.group();
    //     c.sprite = c.box;
    //     for(var i=0, l=this.frames.length; i<l; i++){
    //         c.frames[i] = this.frames[i].clone();
    //         c.box.add(c.frames[i]);
    //     }
    //     return c;
    // };

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

    // this.bitmask = function(){
    //     var mask = [];
    //     for(var i=0, l=this.frames.length; i<l; i++){
    //         var bits = this.frames[i].select('.bitmap').members[1].children();
    //         for(var j=0, k=bits.length; j<k; j++){
    //             mask.push([Math.floor(this.box.x() + bits[j].x()), Math.floor(this.box.y() + bits[j].y())]);
    //         }
    //     }
    //     console.log(mask)
    //     return mask;
    // };

    // this.collision = function(obj){
    //     var mask1 = this.bitmask();
    //     var mask2 = obj.bitmask();
    //     console.log(obj)

    //     for(var i=0, l=mask1.length; i<l; i++){
    //         for(var j=0, k=mask2.length; j<k; j++){
    //             if(mask1[i][0]===mask2[j][0] && mask1[i][1]===mask2[j][1])
    //                 return true;
    //         }
    //     }
    //     return false;
    // };
    //
    this.bitmask = function(){
        // console.log(this.box.x(), this.box.y());
        return { x0: this.box.x(), x1 : this.box.x() + this.box.bbox().width, y0: this.box.y(), y1: this.box.y() + this.box.bbox().height }
    };

    this.collision = function(obj){
        var a = this.bitmask();
        var b = obj.bitmask();
        return !( a.x1 < b.x0 || a.x0 > b.x1 || a.y0 > b.y1 || a.y1 < b.y0 )
    };
}