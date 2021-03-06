/* globals __DEV__ */
import Phaser from 'phaser'

import Rx from 'rxjs';
import RoundController from '../state-management/RoundController';
import SceneController from '../state-management/SceneController';
import WebFont from 'webfontloader'

export default class extends Phaser.State {
    init(parameter) {
        this.score = parameter.score;
        this.sessionId = parameter.sessionId;


        this.sceneController = new SceneController(this.game);
    }
    preload() {
        WebFont.load({
            google: {
                families: ['Bangers', 'VT323']
            },
            active: this.fontsLoaded
        })

        let win = this.add.text(this.world.centerX, this.world.centerY, 'You Win', {
            font: '30px VT323',
            fill: '#dddddd',
            align: 'center'
        })
        win.anchor.setTo(0.5, 0.5);
        let score = this.add.text(this.world.centerX, this.world.centerY + 40, `Your score was: ${this.score}`, {
            font: '50px VT323',
            fill: '#dddddd',
            align: 'center'
        })
        score.anchor.setTo(0.5, 0.5);


        let playAgain = this.add.text(this.world.centerX, this.world.centerY + 80, 'Play Again?', {
            font: '30px VT323',
            fill: '#dddddd',
            align: 'center'
        })
        playAgain.anchor.setTo(0.5, 0.5);

        //enable input on the bomb
        playAgain.inputEnabled = true;

        //then when user clicks it, activate the method on the object
        playAgain.events.onInputDown.add(() => {
          this.sceneController.toScene("Game",true,false)
        });

        // turning off writing high scores to the DB for now...
        this.game.firebase.writeHighScore('Test Player', this.score, this.sessionId).then(data => {
            console.log(data);
        });
    }
    create() {

    }
    update() {


    }
    listScores() {
        // TODO: Get the scores and list the highest 10.
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
