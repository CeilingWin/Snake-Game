/**
 * Created by Fresher on 11/16/2020.
 */

var GameLayer = cc.Layer.extend({
    ctor:function(){
        this._super();
        this.sprites = [];
        // debug
        var bgr= new cc.LayerColor(cc.color(0,0,255),config.game_layer_width,config.game_layer_height);
        bgr.ignoreAnchorPointForPosition(false);
        bgr.x = config.game_layer_width/2;
        bgr.y = config.game_layer_height/2;
        this.addChild(bgr);

        // init
        this.init();
        this.snake = new Snake(this);
        this.drawSnake();
        //this.scheduleUpdate();
    },

    init:function(){
        this.numOfColumn = config.game_layer_width/config.block_size;
        this.numOfLine = config.game_layer_height/config.block_size;
        this.states=[];
        for (var i=0;i<this.numOfLine;i++){
            this.states[i]=[];
            for (var j=0;j<this.numOfColumn;j++){
                this.states[i][j]=0;
            }
        }
    },
    drawSnake:function(){
        var body = this.snake.body;
        cc.log(body[0].position.x);
        for (var i =0; i<body.length;i++){
            this.sprites[i] = new cc.Sprite(body[i].type[1]);
            this.sprites[i].anchorX=0; this.sprites[i].anchorY=0;
            this.sprites[i].setScale(config.block_size/40,config.block_size/40);
            this.sprites[i].setPosition(this._convertToPixel(body[i].position));
            this.addChild(this.sprites[i]);
            cc.log(i+" :"+ body[i].type+","+body[i].position.y+"->"+body.length);
        }
        //this.removeChild(this.sprites[0]);
    },
    update:function(dt){
        cc.log(dt);
        this._clear();
        this.drawSnake();
    },
    _convertToPixel:function(position){
        x = position.x*config.block_size;
        y = position.y*config.block_size;
        return cc.p(x,y);
    },
    _clear:function(){
        for (var i=0 ;i< this.sprites.length;i++){
            this.removeChild(this.sprites[i]);
        }
    }
})