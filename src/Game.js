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
        this.addChild(colorLayer);
    }
})