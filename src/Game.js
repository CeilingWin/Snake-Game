/**
 * Created by Fresher on 11/13/2020.
 */


var Game = cc.Scene.extend({
    onEnter:function(){
        this._super();
        this.init();
    },

    init:function(){
        //background
        var bgr= new cc.LayerColor(cc.color(255,0,0,128),cc.winSize.width,cc.winSize.height);
        bgr.ignoreAnchorPointForPosition(false);
        bgr.x = cc.winSize.width/2;
        bgr.y = cc.winSize.height/2;
        this.addChild(bgr);

        this.gameLayer = new GameLayer();
        this.gameLayer.anchorX=0;
        this.gameLayer.anchorY=0;
        this.gameLayer.setPosition(cc.p((config.game_scene_width-config.game_layer_width)/2,
            (config.game_scene_height-config.game_layer_height)/2));
        this.addChild(this.gameLayer);

    }
})

