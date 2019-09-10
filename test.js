
SVG.on(document, 'DOMContentLoaded', function() {
    var q, ql, i, l;
    var screen = SVG('drawing');
    screen.rect('100%', '100%').fill('#000');
    var sprite  = screen.group();
    var sprite2 = screen.group();
    var bal2    = screen.group();
    // var rect = screen.rect(1, 1).move(100, 50).fill('#f06')
    var d1, d2, d3, d4, d5, d6, d7, d8;
    var loc = [0, 0];

    var dim = 8;
    var pix = 2;

    d1 = [
            0,0,0,1,1,1,1,0,
            0,0,0,0,0,3,0,0,
            0,0,0,0,0,2,2,2,
            0,0,0,0,2,2,2,2,
            0,0,0,0,2,2,2,2,
            0,0,0,0,3,1,3,2,
            0,0,0,3,3,1,3,1,
            0,0,0,3,3,3,3,1
        ];
    d2 = [
            0,0,3,0,0,0,0,0,
            0,3,0,0,0,0,0,0,
            2,2,0,0,0,0,0,0,
            3,2,2,0,0,3,0,0,
            2,2,2,0,3,3,0,0,
            2,2,2,0,3,3,0,0,
            2,2,2,2,2,3,3,0,
            2,2,1,2,2,0,0,0
        ];

    d3 = [
            0,0,0,0,0,3,3,3,
            0,0,0,0,0,0,1,1,
            0,0,0,0,0,0,0,1,
            0,0,0,0,0,2,0,1,
            0,0,0,0,0,2,2,2,
            0,0,0,0,0,0,2,2,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0
        ];

    d4 = [
            3,1,2,2,0,0,0,0,
            1,2,2,1,0,0,0,0,
            3,1,1,1,0,0,0,0,
            1,1,1,1,0,0,0,0,
            1,1,1,0,0,0,0,0,
            2,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0
        ];

    d5 = [
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,1,1,1,1,0
        ];

    d6 = [
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,1,1,1,1,0,0,0,
            1,1,1,1,1,1,0,0
        ];

    d7 = [
            0,0,1,1,1,1,1,1,
            0,1,1,1,1,1,3,1,
            0,1,1,1,1,1,1,3,
            1,1,1,1,1,1,1,3,
            1,1,1,1,1,1,1,1,
            0,1,1,1,1,1,1,1,
            0,1,1,1,1,1,1,1,
            0,0,1,1,1,1,1,1
        ];

    d8 = [
            2,1,1,1,3,1,1,0,
            1,2,1,1,1,3,1,0,
            1,2,1,1,1,3,1,1,
            1,1,2,1,1,1,1,1,
            1,1,2,1,1,1,1,0,
            1,2,1,1,1,1,1,0,
            1,2,1,1,1,1,0,0,
            0,1,1,1,1,0,0,0
        ];

    d9 = [
            0,0,3,0,0,0,0,0,
            0,3,0,0,0,0,0,0,
            2,2,0,0,0,0,0,0,
            3,2,2,0,0,0,0,0,
            2,2,2,0,0,0,0,0,
            2,2,2,0,0,0,0,0,
            2,2,2,0,0,0,0,0,
            2,2,1,2,2,3,3,0
        ];

    d10 = [
            3,1,2,2,2,3,3,3,
            1,2,2,1,0,3,0,0,
            3,1,1,1,0,0,0,0,
            1,1,1,1,0,0,0,0,
            1,1,1,0,0,0,0,0,
            2,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0
        ];

    d11 = [
            0,0,3,0,0,0,0,0,
            0,3,0,0,0,0,0,0,
            2,2,0,0,0,0,0,0,
            3,2,2,0,0,0,0,0,
            2,2,2,0,0,0,0,0,
            2,2,2,0,0,0,0,0,
            2,2,2,0,0,0,0,0,
            2,2,0,0,0,0,0,0
        ];

    d12 = [
            3,1,1,0,0,0,0,0,
            1,2,2,2,0,0,0,0,
            3,1,2,2,2,0,0,0,
            1,1,1,2,2,0,0,0,
            1,1,1,3,3,3,0,0,
            2,0,0,0,3,3,3,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0
        ];

    d13 = [
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,1,1,1,1,0,
            0,0,1,1,1,1,1,1,
    ];

    d14 = [
            0,1,1,1,1,1,3,1,
            0,1,1,1,1,1,1,3,
            1,1,1,1,1,1,1,3,
            1,1,1,1,1,1,1,1,
            0,1,1,1,1,1,1,1,
            0,1,1,1,1,1,1,1,
            0,0,1,1,1,1,1,1,
            0,0,0,1,1,1,1,1
    ];

    d15 = [
            0,0,0,0,3,0,0,0,
            0,0,0,0,0,3,0,0,
            0,0,0,0,0,2,2,2,
            0,0,0,0,2,2,2,2,
            0,0,0,0,2,2,2,2,
            0,0,0,0,3,1,3,2,
            0,0,0,3,3,1,3,1,
            0,0,0,3,3,3,3,1
        ];

    var dude1 = [d1, d2, d3, d4];
    var dude2 = [d1, d9, d3, d10];
    var dude3 = [d1, d11, d3, d12];
    var dude4 = [d15, d9, d3, d10];
    var bal1 = [d5, d6, d7, d8];
    var bal2 = [d13, d6, d14, d8];

    var palette = [null, '#f06', '#06f', '#fc9'];

    function drawSprite(matrix, offset){
        var sprite = screen.group();
        offset === undefined ? {x : 0, y : 0} : offset;
        for(q=0, ql=matrix.length; q<ql; q++){
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
            for(i=0, l=matrix[q].length; i<l; i++){
                var row = parseInt(i/dim);
                var mod = i%dim;
                if(palette[matrix[q][i]]!==null)
                    sprite.rect(pix, pix).move(offset.x + loc[0]+pix*mod, offset.y + loc[1]+row*pix).fill(palette[matrix[q][i]]);
            }
        }
        return sprite;
    }

    balloon = drawSprite(bal1, { x:10, y:0 });
    sprite  = drawSprite(dude1, { x:10, y:dim*2*pix });
    // sprite.animate(2000, '>', 1000).move(10, 30)

    var counter = 0;
    var frame = 0;
    var animate = function(){
        if(counter%10===0){
            if(frame===0){
                sprite.remove();
                balloon.remove();
                sprite  = drawSprite(dude1, { x:10, y:dim*2*pix});
                balloon = drawSprite(bal1, { x:10, y:0 });
                sprite.attr({'id':'dude1'});
                balloon.attr({'id':'balloon1'});
                frame += 1;
            }
            else{
                if(frame==1){
                    sprite.remove();
                    sprite = drawSprite(dude2, { x:10, y:dim*2*pix});
                    sprite.attr({'id':'dude2'});
                    frame += 1;
                }
                else if (frame==2){
                    sprite.remove();
                    sprite = drawSprite(dude3, { x:10, y:dim*2*pix});
                    sprite.attr({'id':'dude3'});
                    frame += 1;
                }
                else if(frame==3){
                    sprite.remove();
                    balloon.remove();
                    sprite = drawSprite(dude4, { x:10, y:dim*2*pix + 2*pix});
                    balloon = drawSprite(bal2, { x:10, y: 2*pix });
                    sprite.attr({'id':'dude4'});
                    balloon.attr({'id':'balloon2'});
                    frame = 0;
                }
            // sprite.move(10, 0)
            }
            // sprite.move(10, pix*2)
        }
        counter++;
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    // console.log(screen.select('g'))
})
