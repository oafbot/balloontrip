function Sprite(screen, palette, dim, pix){
    var loc = [0, 0];

    this.frames = [];

    this.init = function(){
        this.box = screen.group();
    }

    this.draw = function(bitmap, offset){
        var q, ql, i, l, row, mod,

        frame = screen.group();

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
        var group = screen.group();
        group.add(sprite1);
        group.add(sprite2);
        return group;
        // return sprite1.bbox().merge(sprite2.bbox());
    }

    this.add = function(){
        var group = screen.group();
        for(var i=0, l=arguments.length; i<l; i++){
            group.add(arguments[i]);
            this.frames.push(arguments[i]);
        }
        return {
            sprite : group,
            move : function(x, y){ group.dmove(x, y); }
        };
    }

}