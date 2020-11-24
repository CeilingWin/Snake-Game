/**
 * Created by Fresher on 11/23/2020.
 */
var Setting = cc.Scene.extend({
    ctor:function(){
        this._super();
        this.init();
    },
    init:function(){
        //background
        var bgr = cc.Sprite(res.bgr_start_menu_png);
        bgr.anchorX = 0;
        bgr.anchorY = 0;
        var size = bgr.getBoundingBox();
        bgr.setScale(config.game_scene_width/size.width,config.game_scene_height/size.height);
        this.addChild(bgr);

        // level
        cc.MenuItemFont.setFontName("Arial");
        cc.MenuItemFont.setFontSize(25);
        var lb_level = new cc.MenuItemFont("Level");
        lb_level.setEnabled(false);
        var lb_back = new cc.MenuItemFont("Back");
        lb_back.setCallback(this.back);
        var lv = new cc.MenuItemToggle(new cc.MenuItemFont("Easy"), new cc.MenuItemFont("Medium"),
        new cc.MenuItemFont("Hard"));
        lv.setSelectedIndex(config.default_level);
        lv.setCallback(this.levelCallBack);
        var menu =new cc.Menu(lb_level,lv,lb_back);
        menu.alignItemsInColumns(2,1,1);
        this.addChild(menu);
        // Back btn
    },
    levelCallBack:function(id){
        config.default_level = id.getSelectedIndex();
        switch(config.default_level){
            case 0: config.default_speed = 3; break;
            case 1: config.default_speed = 5; break;
            case 2: config.default_speed = 7; break;
        }
    },
    back:function(){
        cc.director.runScene(new StartMenu());
    }
})