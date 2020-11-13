/**
 * Created by Fresher on 11/13/2020.
 */
var colorLayer = new cc.LayerColor(cc.color(0,255,32,128),cc.winSize.width,cc.winSize.height);
colorLayer.ignoreAnchorPointForPosition(false)
colorLayer.x = cc.winSize.width/2;
colorLayer.y = cc.winSize.height/2;

var StartMenu = cc.Scene.extend({
    gameSize:cc.p(config.game_width,config.game_height),
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
        //this.addChild(bgr);

        //button
        var btn_new_game= ccui.Button.create();
        btn_new_game.titleFontSize=40;
        btn_new_game.titleText = "NEW GAME";
        btn_new_game.setPosition(cc.p(this.gameSize.x/2,this.gameSize.y/2));
        btn_new_game.addClickEventListener(
            this.startNewGame
        )
        this.addChild(btn_new_game);

        var btn_high_score = ccui.Button.create();
        btn_high_score.titleFontSize=40;
        btn_high_score.titleText = "HIGH SCORE";
        btn_high_score.setPosition(cc.p(this.gameSize.x/2,this.gameSize.y/3));
        btn_high_score.addClickEventListener(
            this.showHigthScore
        )
        this.addChild(btn_high_score);
       // this.scheduleUpdate();
    },

    startNewGame:function(){
        cc.log("new game!");
        cc.LoaderScene.preload(res,function(){
            cc.director.runScene(new Game());
        },this)
        //cc.director.runScene(new Game());
    },

    showHigthScore:function(){
        cc.log("high score");
    },



    update: function(dt){

    },

})

