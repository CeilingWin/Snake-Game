/**
 * Created by Fresher on 11/16/2020.
 */

var GameLayer = cc.Layer.extend({
    ctor:function(){
        this._super();
        this.sprites = [];
        // debug
        var bgr= new cc.LayerColor(cc.color(255,222,173),config.game_layer_width,config.game_layer_height);
        bgr.ignoreAnchorPointForPosition(false);
        bgr.x = config.game_layer_width/2;
        bgr.y = config.game_layer_height/2;
        this.addChild(bgr);

        // init
        this.init();
        this.snake = new Snake(this);
        this.drawSnake();

        // add listener
        cc.eventManager.addListener({
            event:cc.EventListener.KEYBOARD,
            onKeyPressed:this.handleKey,
        },this)
        this.scheduleUpdate();
    },

    init:function(){
        this.numOfColumn = config.game_layer_width/config.block_size;
        this.numOfLine = config.game_layer_height/config.block_size;
        this.states=[];
        for (var i=0;i<this.numOfLine;i++){
            this.states[i]=[];
            for (var j=0;j<this.numOfColumn;j++){
                this.states[i][j]=0;
            }
        }
        this.direction = DIRECTION.UP; // right key
    },
    handleKey:function(keyCode, event){
        var self = event.getCurrentTarget();
        // w 87, a 65 , d 68, s 83
        switch(keyCode){
            case 87,38:
                self.direction = DIRECTION.UP;
                break;
            case 83,40:
                self.direction = DIRECTION.DOWN;
                break;
            case 65,37:
                self.direction = DIRECTION.LEFT;
                break;
            case 68,39:
                self.direction = DIRECTION.RIGHT;
                break;
        }
    },
    drawSnake:function(){
        this.sprites = this.snake.getSprites();
        for (var i = 0; i<this.sprites.length;i++){
            this.addChild(this.sprites[i]);
        }
    },
    update:function(dt){
        this.snake.move(dt,this.direction);
    },

    _clear:function(){
        for (var i=0 ;i< this.sprites.length;i++){
            this.removeChild(this.sprites[i]);
        }
    }
})