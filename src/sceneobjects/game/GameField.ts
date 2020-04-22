import { ILayouts } from "../../ILayouts";
import { IGameConfig } from "../../IGameConfig";
import * as GameObjectsFactory from "./GameObjectsFactory"
import * as CameraEffects from "./CameraEffects";

export class GameField {

    private player;
    private ground;
    private firstPlanContainer: Phaser.GameObjects.Container;
    private secondPlanContainer: Phaser.GameObjects.Container;
    private nextPlatformY: number;
    private currentPlatform: Phaser.Physics.Arcade.Image;
    private playerX: number;
    private firstTouch = true;
    private counter = 0;
    private autoplay:boolean = false;

    private onScoreUpdate: (number) => void;
    private onGameStart: () => void;
    private onJump: () => void;
    private onFall: () => void;

    constructor(
        private scene: Phaser.Scene,
        private gameConfig: IGameConfig,
        private layouts: ILayouts) {}

    create(): GameField {
        this.secondPlanContainer = this.scene.add.container(0, 0);
        this.firstPlanContainer = this.scene.add.container(0, 0);

        GameObjectsFactory.addBackground.call(this);
        GameObjectsFactory.addGround.call(this);
        GameObjectsFactory.addCharacter.call(this);

        this.scene.physics.add.collider(this.player, this.ground);

        let button = this.scene.add.image(0, 0, 'sprites', 'invisible-block').setScale(10, 50).setOrigin(0, 0);
        button.setInteractive();
        button.on('pointerdown', (() => {
            this.onTap.call(this);
        }).bind(this));

        return this;
    }

    onTap(pointer: Phaser.Input.Pointer) {
        if (this.player.body.touching.down) {
            if (this.firstTouch) {
                this.firstTouch = false;
                this.onGameStart();
                setTimeout(() => {
                    this.currentPlatform = GameObjectsFactory.addPlatform.call(this);
                }, 2500);
            } else if (!this.autoplay) {
                this.playerJump();
            }
        }
    }

    update() {
        if (this.currentPlatform && this.autoplay && this.player.body.touching.down) {
            let distance = Math.abs(this.player.x - this.currentPlatform.x);
            if ( distance < 500 && distance > 350 ) {
                this.playerJump();
            }
        }
    }

    setAutoMode(autoplay: boolean) {
        this.autoplay = autoplay;
    }

    private playerJump() {
        this.player.setVelocityY(-1 * this.gameConfig.playerJumpVelocity);
        this.onJump();
    }

    private onPlayerContactPlatform(character, platform) {
        if (platform.noTouchYet) {
            platform.noTouchYet = false;
            platform.setVelocityX(0);
            this.ground.clear();
            setTimeout(() => {
                if (Math.abs(character.x - this.playerX) < 15) {
                    this.playerX = character.x;
                    CameraEffects.goingUpOnDemand.call(this, character);
                    this.currentPlatform = GameObjectsFactory.addPlatform.call(this);
                    this.counter++;
                    this.onScoreUpdate(this.counter);
                } else {
                    this.onFall();
                    character.setAngularVelocity(250);
                    CameraEffects.setCameraZoom.call(this);
                }
            }, 100);
        }
    }

    setScoreUpdateCallback(callback: (number) => void): void {
        this.onScoreUpdate = callback;
    }

    setGameStartCallback(callback: () => void): void {
        this.onGameStart = callback;
    }

    setJumpCallback(callback: () => void): void {
        this.onJump = callback;
    }

    setFallCallback(callback: () => void): void {
        this.onFall = callback;
    }

}