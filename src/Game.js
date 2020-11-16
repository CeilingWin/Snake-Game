/**
 * Created by Fresher on 11/13/2020.
 */


var Game = cc.Scene.extend({
    onEnter:function(){
        this._super();
        this.init();
    },

    init:function(){
        var colorLayer = new cc.LayerColor(cc.color(0,255,32,128),cc.winSize.width,cc.winSize.height);
        colorLayer.ignoreAnchorPointForPosition(false)
        colorLayer.x = cc.winSize.width/2;
        colorLayer.y = cc.winSize.height/2;
        var snake = new Snake();
        snake.setPosition(cc.p(100,100));
        this.addChild(colorLayer);
        this.addChild(snake);
    }
})

var Snake = cc.Layer.extend({
    ctor:function(){
        this._super(300,200);
        this.init();
        return true;
    },
    init:function(){
        var head = cc.Sprite("res/snake/head_right.png");
        var body = cc.Sprite("res/snake/body_topleft.png");
        head.setPosition(cc.p(50,50));
        body.setPosition(cc.p(50,300));
        this.addChild(head);
        this.addChild(body);
    }
})