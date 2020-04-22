import "phaser";
import { GameScene } from "./scenes/gameScene";
import { LoaderScene } from "./scenes/LoaderScene";

interface Size {
    width: number;
    height: number;
}

export const gameSize: Size = {
    width: 1080,
    height: 1920
}

const tdGameConfig: any = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: gameSize.width,
        height: gameSize.height
    },
    backgroundColor: '#c9dcfa',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 3000 },
            debug: false
        }
    },
    scene: [LoaderScene, GameScene]
};

export class tdOrcsGame extends Phaser.Game {
    constructor() {
        super(tdGameConfig);
    }
}

window.onload = () => {
    let game = new tdOrcsGame();
};