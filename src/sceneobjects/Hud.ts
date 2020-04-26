import { ILayouts, IPoint } from "../ILayouts";
import { IGameConfig } from "../IGameConfig";

const hudTextStyle = {
    fontSize: '48px',
    fontFamily: 'press_start_2pregular',
    color: '#002844'
};

const infoTextFontSize = 120;
const textColorRed = '#990000';
const textColorGreen = '#00ee00';

const scoreSuffixLabel = "SCORE : ";
const startapTextLabel = "TAP !";
const endTextLabel = "WASTED!";

const autoOnLabel = "AUTO [ ]";
const autoOffLabel = "AUTO [V]";

const installLabel = "INSTALL";
const restartLabel = "RESTART";

const isAndroid = /Android/i;
const isIOS = /iPad|iPhone|iPod/i;

export class Hud {

    private hudContainer: Phaser.GameObjects.Container;
    private scoreText: Phaser.GameObjects.Text;
    private infoText: Phaser.GameObjects.Text;
    private autoButtonText: Phaser.GameObjects.Text;
    private autoButton: Phaser.GameObjects.Image;
    private restartButtonText: Phaser.GameObjects.Text;
    private restartButton: Phaser.GameObjects.Image;
    private auto: boolean = false;
    private autoChangeCallback: (boolean) => void;
    private restartCallback: () => void;

    constructor(
        private scene: Phaser.Scene,
        private gameConfig: IGameConfig,
        private layouts: ILayouts) {}

    create(): Hud {
        this.hudContainer = this.scene.add.container(0, 0);

        this.autoButton = this.createButton(this.layouts.hud.auto_button, () => {
            this.auto = !this.auto;
            this.autoButtonText.text = this.auto ? autoOffLabel : autoOnLabel;
            let color =  this.auto ? textColorGreen : hudTextStyle.color;
            this.autoButtonText.setColor(color);
            this.autoChangeCallback(this.auto);
        });

        this.restartButton = this.createButton(this.layouts.hud.restart_button, () => {
            this.restartCallback();
        });

        if (this.checkPlatform(isAndroid) || this.checkPlatform(isIOS)) {
            let instalURL = this.checkPlatform(isIOS) ? this.gameConfig.iOSInstall : this.gameConfig.AndroidInstall;
            this.createButton(this.layouts.hud.install_button, () => {
                let dapi = (window as any).dapi;
                if (dapi === undefined) {
                    window.open(instalURL, '_blank');
                } else {
                    dapi.openStoreUrl();
                }
            });
            this.createText(installLabel, this.layouts.hud.install_button);
        }

        this.scoreText = this.createText("", this.layouts.hud.score_label);
        this.infoText = this.createText(startapTextLabel, this.layouts.hud.info_label);
        this.infoText.setFontSize(infoTextFontSize);
        this.autoButtonText = this.createText(autoOnLabel, this.layouts.hud.auto_button);
        this.restartButtonText = this.createText(restartLabel, this.layouts.hud.restart_button);

        this.setRestartButtonVisible(false);

        return this;
    }

    setScore(score: number): void {
        this.scoreText.text = scoreSuffixLabel + score;
    }

    private createText(label: string = "", position: { x: number, y: number }): Phaser.GameObjects.Text {
        let text = this.scene.add.text(position.x, position.y, label, hudTextStyle);
        text.setOrigin(0.5, 0.5);
        this.hudContainer.add(text);
        return text;
    }

    private createButton(position: IPoint, callback: () => void): Phaser.GameObjects.Image {
        let button = this.scene.add.image(position.x, position.y, 'sprites', 'block').setScale(4, 1.5);
        this.hudContainer.add(button);
        button.setInteractive();
        button.on('pointerdown', (() => {
            callback();
        }).bind(this));
        return button;
    }

    onAutoChangeCallback(callback: (boolean) => void): void {
        this.autoChangeCallback = callback;
    }
    
    onRestartCallback(callback: () => void): void {
        this.restartCallback = callback;
    }

    private checkPlatform(platform: string | RegExp): boolean {
        var UA = window.navigator.userAgent;
        return !!UA.match(platform);
    }

    private setRestartButtonVisible(visible:boolean): void {
        this.restartButtonText.visible = visible;
        this.restartButton.visible = visible;
    }

    onGameStart() {
        this.setScore(0);
        this.infoText.text = "";
    }

    onGameEnd() {
        this.infoText.setColor(textColorRed);
        this.infoText.text = endTextLabel;
        this.setRestartButtonVisible(true);
        this.autoButtonText.visible = false;
        this.autoButton.visible = false;
        this.scoreText.setColor(textColorRed);
    }

}