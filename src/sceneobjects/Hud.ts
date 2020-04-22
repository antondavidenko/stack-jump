import { ILayouts, IPoint } from "../ILayouts";
import { IGameConfig } from "../IGameConfig";

const hudTextStyle = {
    fontSize: '48px',
    fontFamily: 'press_start_2pregular',
    color: '#002844'
};

const scoreSuffix = "SCORE : ";
const startapText = "TAP !";

const auto_on = "AUTO ON";
const auto_off = "AUTO OFF";

const install = "INSTALL";

const isAndroid = /Android/i;
const isIOS = /iPad|iPhone|iPod/i;

export class Hud {

    private hudContainer: Phaser.GameObjects.Container;
    private scoreText: Phaser.GameObjects.Text;
    private autoText: Phaser.GameObjects.Text;
    private auto: boolean = false;
    private autoChangeCallback: (boolean) => void;

    constructor(
        private scene: Phaser.Scene,
        private gameConfig: IGameConfig,
        private layouts: ILayouts) {}

    create(): Hud {
        this.hudContainer = this.scene.add.container(0, 0);

        this.createButton(this.layouts.hud.auto_button, () => {
            this.auto = !this.auto;
            this.autoText.text = this.auto ? auto_off : auto_on;
            this.autoChangeCallback(this.auto);
        });

        if (this.checkPlatform(isAndroid) || this.checkPlatform(isIOS)) {
            let instalURL = this.checkPlatform(isIOS) ? this.gameConfig.iOSInstall : this.gameConfig.AndroidInstall;
            this.createButton(this.layouts.hud.install_button, () => {
                window.open(instalURL, '_blank');
            });
            this.createText(install, this.layouts.hud.install_button);
        }

        this.scoreText = this.createText(startapText, this.layouts.hud.info_label);
        this.autoText = this.createText(auto_on, this.layouts.hud.auto_button);

        return this;
    }

    setScore(score: number): void {
        this.scoreText.text = scoreSuffix + score;
    }

    private createText(label: string = "", position: { x: number, y: number }): Phaser.GameObjects.Text {
        let x = position.x;
        let y = position.y;
        let text = this.scene.add.text(x, y, label, hudTextStyle);
        text.setOrigin(0.5, 0.5);
        this.hudContainer.add(text);
        return text;
    }

    private createButton(position: IPoint, callback: () => void): void {
        let button = this.scene.add.image(position.x, position.y, 'sprites', 'block').setScale(4, 1.5);
        this.hudContainer.add(button);
        button.setInteractive();
        button.on('pointerdown', (() => {
            callback();
        }).bind(this));
    }

    onAutoChangeCallback(callback: (boolean) => void): void {
        this.autoChangeCallback = callback;
    }

    checkPlatform(platform: string | RegExp): boolean {
        var UA = window.navigator.userAgent;
        return !!UA.match(platform);
    }

}