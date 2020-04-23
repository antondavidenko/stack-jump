import { ILayouts } from "../../ILayouts";
import { IGameConfig } from "../../IGameConfig";

const charactersList = ['ch01','ch02','ch03','ch04','ch05'];

function createMovingPlatform(isRight:boolean, spawnY:number): Phaser.Physics.Arcade.Image {
    let gameConfig:IGameConfig = this.gameConfig;
    let spawnX = isRight ? gameConfig.platform.spawnXRight : gameConfig.platform.spawnXLeft;
    let result = this.scene.physics.add.image(spawnX, spawnY, 'sprites', 'block').setScale(3);
    this.firstPlanContainer.add(result);
    result.setImmovable(true);
    result.body.allowGravity = false;
    result.setVelocityX((isRight ? -1 : 1) * gameConfig.platform.speed);
    return result
}

export function addPlatform(): Phaser.Physics.Arcade.Image {
    let scene: Phaser.Scene = this.scene;
    let gameConfig:IGameConfig = this.gameConfig;
    let isFirstPlatform = this.nextPlatformY === undefined;
    this.nextPlatformY = isFirstPlatform ? gameConfig.platform.spawnY : this.nextPlatformY - gameConfig.platform.deltaUp;
    let platform = createMovingPlatform.call(this, Math.floor(Math.random() * 2) === 1, this.nextPlatformY);
    platform.noTouchYet = true;
    scene.physics.add.collider(this.player, platform, this.onPlayerContactPlatform.bind(this));
    return platform;
}

export function addBackground():void {
    let background = this.scene.add.image(0, 0, "backgound").setOrigin(0.25, 0.3).setScale(2);
    this.secondPlanContainer.add(background);
    this.secondPlanContainer.add(this.scene.add.image(background.width*3, 0, "backgound").setOrigin(0.25, 0.3).setScale(-2,2));
    this.secondPlanContainer.add(this.scene.add.image(background.width*-1, 0, "backgound").setOrigin(0.25, 0.3).setScale(-2,2));
}

export function addGround():void {
    let scene: Phaser.Scene = this.scene;
    this.ground = scene.physics.add.staticGroup();
    let groundImage = this.ground.create(scene.cameras.main.width / 2, 1800, 'sprites', 'ground').setScale(2).refreshBody();
    this.firstPlanContainer.add(groundImage);
    for (let i=0; i<40; i++) {
        let positionX = groundImage.width*2*i - groundImage.width*2*20;
        this.firstPlanContainer.add(scene.add.image(positionX, 1800, 'sprites', "ground").setScale(-2,2));
    }
}

export function addCharacter():void {
    this.playerX = (this.layouts as ILayouts).gameField.player.x;
    let playerY = (this.layouts as ILayouts).gameField.player.y;
    let character = charactersList[Math.floor(Math.random() * charactersList.length)];
    this.player = this.scene.physics.add.image(this.playerX, playerY, 'sprites', character).setScale(3);
    this.firstPlanContainer.add(this.player);
}