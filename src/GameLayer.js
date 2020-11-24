/**
 * Created by Fresher on 11/16/2020.
 */
var FoodType ={
    NORMAL:res.apple_png,
    SPECIAL:res.mushroom
}
var GameLayer = cc.Layer.extend({
    ctor:function(){
        this._super();
        this.sprites = [];
        var bgr= new cc.LayerColor(cc.color(0,194,0),config.game_layer_width,config.game_layer_height);
        bgr.ignoreAnchorPointForPosition(false);
        bgr.x = config.game_layer_width/2;
        bgr.y = config.game_layer_height/2;
        this.addChild(bgr);
        // background
        var bgr = new cc.Sprite(res.bgr_game,cc.rect(0,0,config.game_layer_width,config.game_layer_height));
        bgr.anchorX=0;
        bgr.anchorY=0;
        bgr.setPosition(cc.p(0,0));
        //this.addChild(bgr);
        // init
        this.init();
        this.newGame();
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
        // food
        this.food ={sprite: cc.Sprite(res.apple_png), position:cc.p(0,0)};
        this.food.sprite.anchorX=0; this.food.sprite.anchorY=0;
        this.food.sprite.setScale(config.block_size/40,config.block_size/40);
        this.addChild(this.food.sprite);
        // special f
        this.specialFood ={sprite: null, position:cc.p(0,0)};

        // lb_game_over label
        this.lb_game_over = ccui.Text("Score:   0","Arial",20);
        this.lb_game_over.anchorX=0; this.lb_game_over.anchorY=0;
        this.lb_game_over.setPosition(config.game_layer_width-this.lb_game_over.getBoundingBox().width,config.game_layer_height);
        this.lb_game_over.setColor(new cc.Color(0,0,0));
        this.addChild(this.lb_game_over,100);
        this.highScore = config.high_score;

        // scr
        this.score_up = ccui.Text("","Arial",20);
        this.addChild(this.score_up);
    },
    newGame:function(){
        this.states=[];
        for (var i=0;i<this.numOfLine;i++){
            this.states[i]=[];
            for (var j=0;j<this.numOfColumn;j++){
                this.states[i][j]=0;
            }
        }
        this.snake = new Snake(this);
        this.drawSnake();
        this.generateFood(FoodType.NORMAL);

        this.direction = DIRECTION.RIGHT; // right key
        this.score = 0;
        this.lb_game_over.setText("Score:0");
        this.endGame = false;
        this.specialFoodCycle = 5;
        this.hsf = false;
        if (this.specialFood.sprite != null) {
            this.removeChild(this.specialFood.sprite);
            this.specialFood.sprite = null;
        }
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
            for (var i = this.sprites.length-1; i>=0;i--){
                this.addChild(this.sprites[i]);
            }
        }
    },
    update:function(dt){
        if (!this.endGame) {
            if (this.specialFoodCycle>0 && this.hsf == true){ this.onCallBack();this.specialFoodCycle-=dt;}
            else if (this.hsf == true){
                this.removeChild(this.specialFood.sprite);
                this.removeChild(this.remainingTime);
                this.specialFood.sprite = null;
                this.states[this.specialFood.position.y][this.specialFood.position.x]=0;
                this.hsf = false;
            }
            var state = this.snake.update(dt, this.direction);
            this.drawSnake();
            if (state == 3) {
                this.endGame = true;
                if (this.score>this.highScore){ this.highScore = this.score; config.high_score=this.highScore;}
                this.resultLayer = new ResultLayer(this,this.score,this.highScore);
                this.addChild(this.resultLayer);
            }
            else if (state == 2) {
                // update lb_game_over
                this.score+=10;
                this.lb_game_over.setText("Score "+this.score);
                // display score
                if (this.score_up != null) this.removeChild(this.score_up);
                this.score_up = ccui.Text("","Arial",20);
                this.addChild(this.score_up,1000);
                this.score_up.stopAllActions();
                this.score_up.setText("+10");
                this.score_up.setColor(new cc.Color(255,255,255));
                this.score_up.setPosition(cc.p(this.snake._convertToPixel(this.snake.body[0].position)));
                this.score_up.runAction(cc.fadeOut(1.5));
                this.generateFood(FoodType.NORMAL);
            }
            else if (state == 4 || state == 6){

                if (state ==4){
                    this.score+=100;
                    this.lb_game_over.setText("Score "+this.score);
                    // display score
                    if (this.score_up != null) this.removeChild(this.score_up);
                    this.score_up = ccui.Text("","Arial",25);
                    this.addChild(this.score_up,1000);
                    this.score_up.stopAllActions();
                    this.score_up.setText("+100");
                    this.score_up.setColor(new cc.Color(255,0,255));
                    this.score_up.setPosition(cc.p(this.snake._convertToPixel(this.snake.body[0].position)));
                    this.score_up.runAction(cc.fadeOut(1.5));
                }

                this.hsf = false;
                this.removeChild(this.specialFood.sprite);
                this.removeChild(this.remainingTime);
                this.specialFood.sprite = null;
            }
            if (Math.random()>0.99 && this.hsf == false){
                this.generateFood(FoodType.SPECIAL);
            }
        }
    },
    replay:function(){
        this.removeChild(this.resultLayer);
        this.newGame();
    },
    generateFood:function(foodType){
        while (true){
            var x = Math.round(Math.random()*(this.numOfColumn-1));
            var y = Math.round(Math.random()*(this.numOfLine-1));
            if (this.states[y][x]==0){
                if (foodType==FoodType.NORMAL){
                    this.food.position = cc.p(x,y);
                    this.states[y][x]=1;
                    this.food.sprite.setPosition(cc.p(this.snake._convertToPixel((this.food.position))));
                }
                else{
                    this.specialFood.sprite = cc.Sprite(res.mushroom);
                    this.specialFood.sprite.anchorX=0; this.specialFood.sprite.anchorY=0;
                    this.specialFood.sprite.setScale(config.block_size/40,config.block_size/40);
                    this.specialFood.position=cc.p(x,y);
                    this.specialFood.sprite.setPosition(cc.p(this.snake._convertToPixel(cc.p(x,y))));
                    this.addChild(this.specialFood.sprite);
                    var random = Math.round(Math.random()*100);
                    if (random%2==0)
                        this.states[y][x]=3;
                    else this.states[y][x]=2;

                    this.hsf = true;
                    this.specialFoodCycle= 10;
                    this.remainingTime = ccui.Text(this.specialFoodCycle,"Arial",15);
                    this.remainingTime.setPosition(this.snake._convertToPixel(cc.p(x,y)));
                    this.addChild(this.remainingTime);
                }
                break;
            }
        }
    },
    onCallBack:function(){
        cc.log("call back");
        if (this.specialFoodCycle>0) {
            this.remainingTime.setText(Math.round(this.specialFoodCycle));
        }
    },
    _clear:function(){
        for (var i=0 ;i< this.sprites.length;i++){
            this.removeChild(this.sprites[i]);
        }
    }
})

var ResultLayer = cc.LayerColor.extend({
    ctor:function(gameLayer,score,highScore){
        this._super(new cc.Color(255,0,0,100),config.game_layer_width,config.game_layer_height);
        if (score == highScore)
            this.setColor(new cc.Color(0,255,0,100));
        // score lb
        this.lb_game_over = ccui.Text("Score "+score,"Arial",20);
        this.lb_game_over.setPosition(cc.p(0,100));
        this.lb_game_over.setColor(new cc.Color(255,0,0,120));
        this.lb_game_over.setPosition(cc.p(config.game_layer_width/2,200));
        // high score lb
        this.lb_high_score = ccui.Text("High Score "+highScore,"Arial",20);
        this.lb_high_score.setPosition(cc.p(0,50));
        this.lb_high_score.setColor(new cc.Color(255,0,0,120));
        this.lb_high_score.setPosition(cc.p(config.game_layer_width/2,150));

        // replay button
        this.btn_replay = ccui.Button.create();
        this.btn_replay.titleText = "Play Again";
        this.btn_replay.titleFontSize=20;
        this.btn_replay.setColor(new cc.Color(255,0,0,120));
        this.btn_replay.setPosition(cc.p(config.game_layer_width/2,100));
        this.btn_replay.addClickEventListener(
            function(){
                gameLayer.replay();
            }
        );

        // exit button
        this.btn_exit = ccui.Button.create();
        this.btn_exit.titleText = "Exit";
        this.btn_exit.titleFontSize=20;
        this.btn_exit.setColor(new cc.Color(255,0,0,120));
        this.btn_exit.setPosition(cc.p(config.game_layer_width/2,70));
        this.btn_exit.addClickEventListener(
            function(){
                cc.director.runScene(new StartMenu());
            }
        )
        this.addChild(this.lb_game_over);
        this.addChild(this.lb_high_score);
        this.addChild(this.btn_replay);
        this.addChild(this.btn_exit);
    },
    setScore:function(score){
        this.lb_game_over.setText("Score "+score);
        if (score>this.highScore) this.highScore=score;
        this.lb_high_score.setText("High Score "+this.highScore);
    }
})

var ResultLayer2 = cc.Layer.extend({
    ctor:function(gameLayer,score,highScore){
        this._super();
        this.anchorX=0.5;
        this.anchorY=0.5;
        //this.x = config.game_layer_width/2;
        //this.y = config.game_layer_height/2;
        this.setPosition(300,500);
        // bgr
        var bgr = cc.Sprite("res/result.png");
        //bgr.attr({
        //    anchorX:0,
        //    anchorY:0,
        //    x:0,
        //    y:0,
        //})
        this.addChild(bgr);

        // result
        this.lb_game_over = ccui.Text("GameOver","Arial",30);
        this.lb_game_over.setPosition(cc.p(0,80));
        this.lb_game_over.setColor(new cc.Color(255,49,102,255));
        this.addChild(this.lb_game_over);

        this.lb_score = ccui.Text("Score "+score,"Arial",20);
        this.lb_score.setPosition(cc.p(0,40));
        this.lb_score.setColor(new cc.Color(255,49,102,100));
        this.addChild(this.lb_score);

        // high score lb
        this.lb_high_score = ccui.Text("High Score "+highScore,"Arial",20);
        this.lb_high_score.setPosition(cc.p(0,0));
        this.lb_high_score.setColor(new cc.Color(255,0,0,120));
        this.addChild(this.lb_high_score);
        this.move();
    },
    move:function(){
        this.runAction(new cc.MoveTo(1,cc.p(config.game_layer_width/2,config.game_layer_height/2)));
    }
})