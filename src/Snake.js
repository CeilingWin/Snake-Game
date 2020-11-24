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
    BODY_TTL:[8,res.body_ttl],
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
        cc.log("speed:"+this.speed);
        this.frameCycle = 1/this.speed;
        this.deltaT = 0;
        this.changed = true;
        this.toxicTime = -1;
        this.spritePool = new SpritePool();
    },
    speedUp:function(x){
        // speed = speed+x
        this.speed +=x;
        if (this.speed>config.max_speed) this.speed = config.max_speed;
        this.frameCycle = 1/this.speed;
    },
    update:function(dt,direction){
        this.deltaT+=dt;
        //this.display
        if (this.toxicTime>0) this.toxicTime -= dt;
        if (this.deltaT>=this.frameCycle){
            this.deltaT = 0;
            if (cc.pDot(this.direction,direction)==0){
                if (this.toxicTime>0){
                    switch (direction){
                        case DIRECTION.DOWN: direction = DIRECTION.UP; break;
                        case DIRECTION.UP: direction = DIRECTION.DOWN; break;
                        case DIRECTION.LEFT: direction = DIRECTION.RIGHT; break;
                        case DIRECTION.RIGHT: direction = DIRECTION.LEFT; break;
                    }
                }
                return this._move(direction);
            }
            else{
                return this._move(this.direction);
            }
        }
        return 0;
    },
    _move:function(direction){
        this.changed = true;

        // 1 : update succes, 2 : eat food , 3 : end game , 4 : special food
        var result = 1;

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
            this.body[0].type = type;
        }
        this.direction = direction;

        // check end game
        if (head.position.x<0 || head.position.x==this.gameLayer.numOfColumn ||
        head.position.y<0 || head.position.y==this.gameLayer.numOfLine) result = 3;
        else if (this.states[head.position.y][head.position.x]==5) result =3;
        else{
            // if new head.position === food.position
            if (this.states[head.position.y][head.position.x]==1){
                this.bodyLength+=1;
                if (this.bodyLength%5==0) this.speedUp(1);
                result = 2;
            }
            else{
                if (this.states[head.position.y][head.position.x]==2){ this.toxicTime = 6; result =6}
                if (this.states[head.position.y][head.position.x]==3) result = 4;
                // unmark tail position
                this.states[this.body[this.bodyLength-1].position.y][this.body[this.bodyLength-1].position.x]=0;
            }
            // mark state head position
            this.states[head.position.y][head.position.x]=5;
        }

        // update body
        for (var i = this.bodyLength-1;i>0;i--){
            this.body[i]=this.body[i-1];
        }
        this.body[0]=head;
        // handle tail
        if (this.body[this.bodyLength-1].type[0]>=10) return 2;
        this.body[this.bodyLength-1].type = this._getTypeTail(this.body[this.bodyLength-1],this.body[this.bodyLength-2]);
        return result;
    },
    _getTypeTail:function(tail,lbody){
        var type;
        var tp = tail.position;
        var lp = lbody.position;
        switch(tail.type[0]){
            case BodyType.BODY_BTL[0]:
                if (tp.x == lp.x) type = BodyType.TAIL_DOWN;
                else type = BodyType.TAIL_LEFT;
                break;
            case BodyType.BODY_BTR[0]:
                if (tp.x == lp.x) type = BodyType.TAIL_DOWN;
                else type = BodyType.TAIL_RIGHT;
                break;
            case BodyType.BODY_HORIZONTAL[0]:
                if (tp.x < lp.x) type = BodyType.TAIL_RIGHT;
                else type = BodyType.TAIL_LEFT;
                break;
            case BodyType.BODY_TTL[0]:
                if (tp.x == lp.x) type = BodyType.TAIL_UP;
                else type = BodyType.TAIL_LEFT;
                break;
            case BodyType.BODY_TTR[0]:
                if (tp.x == lp.x) type = BodyType.TAIL_UP;
                else type = BodyType.TAIL_RIGHT;
                break;
            case BodyType.BODY_VERTICAL[0]:
                if (tp.y < lp.y) type = BodyType.TAIL_UP;
                else type = BodyType.TAIL_DOWN;
                break;
        }
        return type;
    },
    getSprites:function(){
        if (this.changed == false) return null;
        this.changed = false;
        var body = this.body;
        var sprites=[];
        //for (var i =0; i<body.length;i++){
        //    // init sprite
        //    sprites[i] = new cc.Sprite(body[i].type[1]);
        //    sprites[i].anchorX=0; sprites[i].anchorY=0;
        //    sprites[i].setScale(config.block_size/40,config.block_size/40);
        //    if (this.toxicTime>0) sprites[i].setColor(new cc.Color(255,0,0,50));
        //    sprites[i].setPosition(this._convertToPixel(body[i].position));
        //}
        this.spritePool.reset();
        for (var i = 0; i<body.length;i++){
            sprites[i] = this.spritePool.getSprite(body[i].type[0]);
            if (this.toxicTime>0) sprites[i].setColor(new cc.Color(255,0,0,9));
            else sprites[i].setColor(new cc.Color(255,255,255,0));
            sprites[i].setPosition(this._convertToPixel(body[i].position));
        }

        return sprites;
    },
    initBody:function(){
        // init body
        this.body = [];
        var dir = cc.p(-1,0);
        var head = cc.p(Math.round(this.gameLayer.numOfColumn/2),Math.round(this.gameLayer.numOfLine/2));
        this.body[0]={position:head,type:BodyType.HEAD_RIGHT};
        this.states[head.y][head.x]=5;
        var i=1;
        for(;i<config.default_snake_length-1;i++){
            this.body[i]= new Object();
            this.body[i].position=cc.pAdd(this.body[i-1].position,dir);
            this.body[i].type = BodyType.BODY_HORIZONTAL;
            this.states[this.body[i].position.y][this.body[i].position.x]=5;
        }
        this.body[i] = {
            position:cc.pAdd(this.body[i-1].position,dir),
            type:BodyType.TAIL_RIGHT
        };
        this.states[this.body[i].position.y][this.body[i].position.x]=5;
        this.bodyLength = this.body.length;
    },
    _convertToPixel:function(position){
        x = position.x*config.block_size;
        y = position.y*config.block_size;
        return cc.p(x,y);
    },
})