/**
 * Created by Fresher on 11/12/2020.
 */
var TestLayer = cc.Layer.extend({
    ctor:function() {
        this._super();
        this.init();
        return true;
    },
    init:function(){
        var hello = new cc.LabelTTF("CEILING WIN", "Arial",40);
        hello.x=200;
        hello.y=300;
        //this.addChild(hello,10);
        var apple = new cc.Sprite(res.apple_png, cc.rect(100,0,50,50));
        //var apple = new cc.Sprite(res.apple_png);
        apple.anchorX=0;
        apple.anchorY=0;
        //apple.setPosition(cc.p(100,200));
        this.addChild(apple,-100);
    }
})

var TestScene = cc.Scene.extend({
    onEnter:function(){
        this._super();
        var colorLayer = new cc.LayerColor(cc.color(0,255,32,128),cc.winSize.width,cc.winSize.height);
        colorLayer.ignoreAnchorPointForPosition(false)
        colorLayer.x = cc.winSize.width/2;
        colorLayer.y = cc.winSize.height/2;
        this.addChild(colorLayer);
        this.addChild(new TestLayer());

        var apple=new cc.Sprite(res.apple_png);
        this.addChild(apple);
}
})