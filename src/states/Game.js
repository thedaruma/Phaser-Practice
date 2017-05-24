/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../prefabs/Mushroom';
import Bomb from '../prefabs/Bomb';
import Coin from '../prefabs/Coin';
import Player from '../prefabs/Player';
import Heart from '../prefabs/Heart';
import Wall from '../prefabs/Wall';
import CoinParticle from '../prefabs/particles/Coin.particle';

export default class extends Phaser.State {
    init() {
        this.itemCount = 0;
    }
    preload() {
        this.itemGroup = this.game.add.physicsGroup();
        game.input.onDown.add(this.particleBurst, this);
    }
    particleBurst(pointer) {

    }
    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);


        //give the items gravity
        this.game.physics.arcade.gravity.y = 200;

        //keep track of the things that are in the air.
        this.setPlayer();
        // this.setWall();
        this.setRound();



    }
    update() {
        game.physics.arcade.collide(this.wall, this.itemGroup, () => {
            console.log("hitting");
        });
        console.log(this.itemGroup);
    }
    setWall() {
        //create a boundary below the canvas for the items to be destroyed against
        this.wall = new Wall({
            game: this,
            x: this.world.centerX,
            y: this.world.y + this.world.height - 100,
            asset: 'wall'
        });
        this.game.add.existing(this.wall)
        var width = document.documentElement.clientWidth; // example;
        var height = 10 // example;

        this.game.physics.arcade.enable(this.wall);


        // this.game.physics.arcade.enable([]);

        this.wall.body.enable = true;
        this.wall.body.immovable = true;
        this.wall.body.allowGravity = false;
        this.wall.body.setSize(height, width)
    }
    setSprite(type) {
        let item;
        if (type == 'bomb') {
            this.itemCount++;
            item = new Bomb({
                game: this,
                x: this.world.centerX + this.game.rnd.integerInRange(-500, 500),
                y: this.world.y + this.world.height,
                asset: `${type}`,
            });

        } else if (type == 'coin') {
            this.itemCount++;
            item = new Coin({
                game: this,
                x: this.world.centerX + this.game.rnd.integerInRange(-500, 500),
                y: this.world.y + this.world.height,
                asset: `${type}`,
            });
        }
        this.itemGroup.add(item);
        item.name = `${type}_${this.itemCount}`;
        item.type = `${type}`;
        this.game.physics.arcade.enable([item]);
        this.game.add.existing(item);
        item.scale.setTo(this.scaleRatio(), this.scaleRatio());
        //enable input on the bomb
        item.inputEnabled = true;

        //then when user clicks it, activate the method on the object
        item.events.onInputDown.add(() => {
            this.handleClick(item, this);
        });
        this.launchSprite([item])
    }
    removeSprite() {

    }
    setRound() {
        let randomNumberOfSprites = this.game.rnd.integerInRange(2, 10);
        let arrayOfTypes = ['coin', 'bomb'];
        for (let i = 0; i < randomNumberOfSprites; i++) {
            this.setSprite(arrayOfTypes[this.game.rnd.integerInRange(0, 1)]);
        }
        this.roundStart = true;
    }
    handleClick(sprite, game) {
        if (sprite.type == 'bomb') {
            let lostHeart = this.healthArray.pop();
            sprite.bombExplode();
            lostHeart.destroy();
            sprite.destroy();
        } else if (sprite.type == 'coin') {
            sprite.coinSparkle(sprite);
            sprite.destroy();
        }
    }
    expode(sprite) {

    }


    setHealth(currentHealth) {
        let healthStartx = this.world.x + 50;
        let offset = 80;
        this.healthArray = [];
        for (let i = 0; i < currentHealth; i++) {
            let heart = new Heart({
                game: this,
                x: healthStartx + offset * i,
                y: 80,
                asset: 'heart',
            });
            heart.anchor.setTo(0.5, 0.5);
            this.game.add.existing(heart);
            heart.scale.setTo(this.scaleRatio(), this.scaleRatio());
            this.healthArray.push(heart);
        }
    }
    setPlayer() {
        this.player = new Player({
            game: this,
            x: 0,
            y: 0,
            asset: null
        })
        this.player.health = 3;
        this.game.add.existing(this.player);
        this.setHealth(this.player.health);
    }
    launchSprite(array) {
        array.forEach(sprite => {

            // sprite.body.collideWorldBounds = true;
            sprite.body.bounce.y = 0.95;
            sprite.anchor.setTo(0.5, 0.5);
            sprite.body.enable = true;

            sprite.body.velocity.setTo(0, this.game.rnd.integerInRange(-1300 * this.scaleRatio(), this.scaleRatio() * -1800));
            // sprite.body.gravity.y = -1;
            sprite.body.gravity.isCircle = true;
            sprite.body.angularVelocity = this.game.rnd.integerInRange(30, 100);
            sprite.body.angularRotation = this.game.rnd.integerInRange(30, 100);
            sprite.body.angularRotation = 40;

        })
    }
    scaleRatio() {
        return window.devicePixelRatio / 3;
    }
    render() {
        if (__DEV__) {
            // this.game.debug.spriteInfo(this.mushroom, 32, 32);
        }

    }
}
