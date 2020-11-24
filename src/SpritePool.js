/**
 * Created by Fresher on 11/18/2020.
 */

var SpritePool = cc.Class.extend({
    ctor: function () {
        this.pool = [];
        this.cid = [];
        this.N = 0;
        for (var id in BodyType) {
            var numOfSprite;
            var type = BodyType[id];
            if (type[0] < 4 || type[0] > 9) {
                numOfSprite = 1;
            }
            else numOfSprite = 20;
            this.cid[type[0]] = 0;
            this.pool[type[0]] = [];
            for (var i = 0; i < numOfSprite; i++) {
                this.pool[type[0]][i] = cc.Sprite(type[1]);
                this.pool[type[0]][i].anchorX = 0;
                this.pool[type[0]][i].anchorY = 0;
                this.pool[type[0]][i].setScale(config.block_size / 54, config.block_size / 54);
                this.pool[type[0]][i].retain();
            }
            this.N++;
        }
    },
    getSprite: function (id) {
        if (this.pool[id][this.cid[id]] )
        var sprite = this.pool[id][this.cid[id]];
        this.cid[id]++;
        return sprite;
    },
    reset: function () {
        for (var i = 0; i < this.N; i++) this.cid[i] = 0;
    }

})
