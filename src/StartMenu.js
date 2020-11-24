/**
 * Created by Fresher on 11/13/2020.
 */
var colorLayer = new cc.LayerColor(cc.color(0, 255, 32, 128), cc.winSize.width, cc.winSize.height);
colorLayer.ignoreAnchorPointForPosition(false)
colorLayer.x = cc.winSize.width / 2;
colorLayer.y = cc.winSize.height / 2;

var StartMenu = cc.Scene.extend({
    gameSize: cc.p(config.game_scene_width, config.game_scene_height),
    onEnter: function () {
        this._super();
        this.init();
        //debug
        //this.startNewGame();
    },

    init: function () {
        //this.addChild(colorLayer);

        //background
        var bgr = cc.Sprite(res.bgr_start_menu_png);
        bgr.anchorX = 0;
        bgr.anchorY = 0;
        var size = bgr.getBoundingBox();
        bgr.setScale(config.game_scene_width/size.width,config.game_scene_height/size.height);
        this.addChild(bgr);

        // bgr2
        var bgr2 = cc.Sprite("res/start_menu/menulines.png");
        bgr2.attr({
            x:this.gameSize.x/2,
            y:this.gameSize.y/2,
        })
        this.addChild(bgr2);
        bgr2.runAction(cc.sequence(new cc.RotateBy(15,360)).repeatForever());
        // logo
        var logo = cc.Sprite("res/start_menu/logo.png");
        logo.attr({
            x:280,
            y:500,
            scaleX:0.5,
            scaleY:0.5
        })
        this.addChild(logo);
        logo.runAction(new cc.MoveTo(1,cc.p(280,300)));

        // play button
        var btn_new_game = ccui.Button.create();
        btn_new_game.loadTextures(res.new_game_png,"res/start_menu/ic_play_c.png");
        btn_new_game.scaleX = 0.5;
        btn_new_game.scaleY = 0.5;
        btn_new_game.setPosition(cc.p(this.gameSize.x / 2, this.gameSize.y+40));
        btn_new_game.addClickEventListener(
            this.startNewGame
        );
        this.addChild(btn_new_game);
        this.btn_new_game_position = cc.p(this.gameSize.x / 2, this.gameSize.y / 2);
        var btn_new_game_action = new cc.MoveTo(1,this.btn_new_game_position);
        btn_new_game.runAction(btn_new_game_action);

        // setting button
        var btn_setting = ccui.Button.create();
        btn_setting.loadTextures(res.setting_png,"res/start_menu/ic_settings_c.png");
        btn_setting.scaleX = 0.5;
        btn_setting.scaleY = 0.5;
        btn_setting.setPosition(cc.p(-50,50));
        btn_setting.addClickEventListener(
            this.showHigthScore
        );
        this.addChild(btn_setting);
        btn_setting.runAction(new cc.MoveTo(1,cc.p(50,50)));
    },

    startNewGame: function () {
        cc.log("new game!");
        cc.LoaderScene.preload(res, function () {
            cc.director.runScene(new cc.TransitionFade(0.6, new Game()));
        }, this)
        //cc.director.runScene(new Game());
    },

    showHigthScore: function () {
        cc.director.runScene(new Setting());
    },

})

