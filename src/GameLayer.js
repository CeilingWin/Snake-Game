/**
 * Created by Fresher on 11/16/2020.
 */

var GameLayer = cc.Layer.extend({
    ctor:function(){
        this._super();
        this.sprites = [];
        // debug
        cc.log("sprite size :"+res.sprite_size);
        var bgr= new cc.LayerColor(cc.color(255,222,173),config.game_layer_width,config.game_layer_height);
        bgr.ignoreAnchorPointForPosition(false);
        bgr.x = config.game_layer_width/2;
        bgr.y = config.game_layer_height/2;
        this.addChild(bgr);

        // init
        this.init();
        this.snake = new Snake(this);
        this.drawSnake();
        this.generateFood();

        // add listener
        cc.eventManager.addListener({
            event:cc.EventListener.KEYBOARD,
            onKeyPressed:this.handleKey,
        },this)
        this.scheduleUpdate();
    },

    init:function(){
        this._super();

        this.numOfColumn = config.game_layer_width/config.block_size;
        this.numOfLine = config.game_layer_height/config.block_size;
        this.states=[];
        for (var i=0;i<this.numOfLine;i++){
            this.states[i]=[];
            for (var j=0;j<this.numOfColumn;j++){
                this.states[i][j]=0;
            }
        }
        //this.states[0][0]=1;
        this.direction = DIRECTION.RIGHT; // right key
        // food
        this.food ={sprite: cc.Sprite(res.apple_png), position:cc.p(0,0)};
        this.food.sprite.anchorX=0; this.food.sprite.anchorY=0;
        this.food.sprite.setScale(config.block_size/40,config.block_size/40);
        this.addChild(this.food.sprite);
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
        var sprites = this.snake.getSprites();
        if (sprites!=null){
            this._clear();
            this.sprites = sprites;
            for (var i = 0; i<this.sprites.length;i++){
                this.addChild(this.sprites[i]);
            }
        }
    },
    update:function(dt){
        var state = this.snake.move(dt,this.direction);
        this.drawSnake();
        if (state ==3 ) cc.log("End game");
        if (state ==2 ) this.generateFood();
    },

    generateFood:function(){
        var foodPosition = this.food.position;
        this.states[foodPosition.y][foodPosition.x]=0;
        while (true){
            var x = Math.round(Math.random()*this.numOfColumn);
            var y = Math.round(Math.random()*this.numOfLine);

        }
    },

    _clear:function(){
        for (var i=0 ;i< this.sprites.length;i++){
            this.removeChild(this.sprites[i]);
        }
    }
})