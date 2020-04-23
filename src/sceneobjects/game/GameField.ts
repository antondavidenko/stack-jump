import { ILayouts } from "../../ILayouts";
import { IGameConfig } from "../../IGameConfig";
import * as GameObjectsFactory from "./GameObjectsFactory"
import * as CameraEffects from "./CameraEffects";

export class GameField {

    private player: Phaser.Physics.Arcade.Image;
    private ground: Phaser.Physics.Arcade.StaticGroup;
    private firstPlanContainer: Phaser.GameObjects.Container;
    private secondPlanContainer: Phaser.GameObjects.Container;
    private nextPlatformY: number;
    private currentPlatforms: Phaser.Physics.Arcade.Image[] = [];
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
                    this.addPlatform();
                }, this.gameConfig.platform.firstTimeSpawnDelay);
            } else if (!this.autoplay) {
                this.playerJump();
            }
        }
    }

    private addPlatform() {
        if (this.player.angle === 0) {
            this.currentPlatforms.push(GameObjectsFactory.addPlatform.call(this));
            setTimeout(() => {
                this.addPlatform();
            }, this.getRandomSpawnDelay());
        }
    }

    update() {
        if (this.currentPlatforms[this.counter] && this.autoplay && this.player.body.touching.down) {
            let distance = Math.abs(this.player.x - this.currentPlatforms[this.counter].x);
            if ( distance < this.gameConfig.autoJumpMaxDistance && distance > this.gameConfig.autoJumpMinDistance ) {
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

    private onPlayerContactPlatform(player: Phaser.Physics.Arcade.Image, platform: Phaser.Physics.Arcade.Image) {
        if ((platform as any).noTouchYet) {
            (platform as any).noTouchYet = false;
            platform.setVelocityX(0);
            this.ground.clear();
            setTimeout(() => {
                this.checkJumpSuccess();
            }, 100);
        }
    }

    private checkJumpSuccess() {
        let successCriteria = Math.abs(this.player.x - this.playerX) < 15;
        if (successCriteria) {
            this.playerX = this.player.x;
            CameraEffects.goingUpOnDemand.call(this, this.player);
            this.counter++;
            this.onScoreUpdate(this.counter);
        } else {
            this.onFall();
            this.player.setAngularVelocity(250);
            CameraEffects.setCameraZoom.call(this);
        }
    }

    private getRandomSpawnDelay():number {
        let min = this.gameConfig.platform.minSpawnDelay;
        let max = this.gameConfig.platform.maxSpawnDelay;
        return Math.random() * (max - min) + min;
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