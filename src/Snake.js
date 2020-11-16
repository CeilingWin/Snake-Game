/**
 * Created by Fresher on 11/16/2020.
 */
var BodyType = {
    HEAD_RIGHT:[0,res.head_right],
    HEAD_DOWN:[1,res.head_down],
    HEAD_LEFT:[2,res.head_left],
    HEAD_UP:[3,res.head_up],
    BODY_VERTICAL:[4,res.body_vertical],
    BODY_HORIZONTAL:[5,res.body_horizontal],
    BODY_BTL:[6,res.body_btl],
    BODY_BTR:[7,res.body_btr],
    BODY_TTL:[7,res.body_ttl],
    BODY_TTR:[9,res.body_ttr],
    TAIL_UP:[10,res.tail_up],
    TAIL_DOWN:[11,res.tail_down],
    TAIL_LEFT:[12,res.tail_left],
    TAIL_RIGHT:[13,res.tail_right]
}
var DIRECTION ={
    UP:cc.p(0,1),
    DOWN:cc.p(0,-1),
    RIGHT:cc.p(1,0),
    LEFT:cc.p(-1,0)
}
var Snake=cc.Class.extend({

    ctor:function(gameLayer){
        this.gameLayer = gameLayer;
        this.states = gameLayer.states;
        this.initBody();
        // config
        this.direction = DIRECTION.RIGHT;
        this.speed = config.default_speed;
        this.frameCycle = 1/this.speed;
        this.deltaT = 0;
    },
    move:function(dt,direction){
        this.deltaT+=dt;
        if (this.deltaT>=this.frameCycle){
            this.deltaT = 0;
            if (cc.pDot(this.direction,direction)==0){
                cc.log("di chuyen theo huong moi");
                return this._move(direction);
            }
            else{
                cc.log("di chuyen theo huong cu");
                return this._move(this.direction);
            }
        }
    },
    _move:function(direction){
        // handle head
        var head = {};
        head.position = cc.pAdd(this.body[0].position,direction);
        switch(direction){
            case DIRECTION.DOWN:
                head.type = BodyType.HEAD_DOWN;
                break;
            case DIRECTION.UP:
                head.type = BodyType.HEAD_UP;
                break;
            case DIRECTION.LEFT:
                head.type = BodyType.HEAD_LEFT;
                break;
            case DIRECTION.RIGHT:
                head.type = BodyType.HEAD_RIGHT;
                break;
        }
        if (this.direction==direction){
            if (this.direction.x == 0){
                this.body[0].type = BodyType.BODY_VERTICAL;
            }
            else{
                this.body[0].type = BodyType.BODY_HORIZONTAL;
            }
        }else{
            var type;
            switch (this.direction){
                case DIRECTION.RIGHT:
                    if (direction==DIRECTION.DOWN) type = BodyType.BODY_BTL;
                    else type = BodyType.BODY_TTL;
                    break;
                case DIRECTION.DOWN:
                    if (direction==DIRECTION.LEFT) type = BodyType.BODY_TTL;
                    else type = BodyType.BODY_TTR;
                    break;
                case DIRECTION.LEFT:
                    if (direction==DIRECTION.UP) type = BodyType.BODY_TTR;
                    else type = BodyType.BODY_BTR;
                    break;
                default:
                    if (direction==DIRECTION.LEFT) type = BodyType.BODY_BTL;
                    else type = BodyType.BODY_BTR;
            }
        }
        if (this.states!=0){

        }
    },
    getSprites:function(){
        var body = this.body;
        sprites=[];
        cc.log(body[0].position.x);
        for (var i =0; i<body.length;i++){
            sprites[i] = new cc.Sprite(body[i].type[1]);
            sprites[i].anchorX=0; sprites[i].anchorY=0;
            sprites[i].setScale(config.block_size/40,config.block_size/40);
            sprites[i].setPosition(this._convertToPixel(body[i].position));
            cc.log(i+" :"+ body[i].type+","+body[i].position.x+"->"+body.length);
        }
        return sprites;
    },
    initBody:function(){
        // init body
        this.body = [];
        var dir = cc.p(-1,0);
        var head = cc.p(Math.round(this.gameLayer.numOfColumn/2),Math.round(this.gameLayer.numOfLine/2));
        var head = cc.p(7,0);
        this.body[0]={position:head,type:BodyType.HEAD_RIGHT};
        var i=1;
        for(;i<config.default_snake_length-1;i++){
            this.body[i]= new Object();
            this.body[i].position=cc.pAdd(this.body[i-1].position,dir);
            this.body[i].type = BodyType.BODY_HORIZONTAL;
        }
        this.body[i] = {
            position:cc.pAdd(this.body[i-1].position,dir),
            type:BodyType.TAIL_RIGHT
        };
    },
    _convertToPixel:function(position){
        x = position.x*config.block_size;
        y = position.y*config.block_size;
        return cc.p(x,y);
    },
})