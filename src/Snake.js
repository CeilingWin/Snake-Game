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

var Snake=cc.Class.extend({
    ctor:function(gameLayer){
        this.gameLayer = gameLayer;
        this.states = gameLayer.states;
        // init body
        this.body = [];
        var dir = cc.p(-1,0);
        var head = cc.p(Math.round(this.gameLayer.numOfColumn/2),Math.round(this.gameLayer.numOfLine/2));
        this.body[0]={position:head,type:BodyType.HEAD_RIGHT};
        var i=1;
        for(;i<config.default_snake_length-1;i++){
            this.body[i]= new Object();
            this.body[i].position=cc.pAdd(this.body[i-1].position,dir);
            this.body[i].type = BodyType.BODY_HORIZONTAL;
        }
        this.body[i] = {position:this.body[i-1].position,type:BodyType.TAIL_RIGHT};
    }
})