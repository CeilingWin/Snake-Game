/**
 * Created by Fresher on 11/13/2020.
 */
var colorLayer = new cc.LayerColor(cc.color(0,255,32,128),cc.winSize.width,cc.winSize.height);
colorLayer.ignoreAnchorPointForPosition(false)
colorLayer.x = cc.winSize.width/2;
colorLayer.y = cc.winSize.height/2;

var StartMenu = cc.Scene.extend({
    onEnter:function(){
        this._super();
        this.init();
    },

    init:function(){
        this.addChild(colorLayer);

        //background
        var bgr = new cc.Sprite(res.bgr_start_menu_png, cc.rect(75,10,600,400));
        bgr.anchorX=0;
        bgr.anchorY=0;

        this.addChild(bgr);

        //button
        var btn_new_game= ccui.Button.create();
        btn_new_game.titleFontSize=50;
        btn_new_game.titleText = "NEW GAME";
        this.addChild(btn_new_game);
       // this.scheduleUpdate();
    },

    update: function(dt){

    },

})

