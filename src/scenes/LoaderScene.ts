export class LoaderScene extends Phaser.Scene {

    constructor() {
        super("LoaderScene");
    }

    preload(): void { }

    init(params: any): void {}

    create() {
        this.scene.stop("LoaderScene");
        this.scene.start("GameScene");
    }

}