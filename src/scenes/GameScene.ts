import { LoaderView } from "../sceneobjects/LoaderView";
import { IGameConfig } from "../IGameConfig";
import { ILayouts } from "../ILayouts";
import { GameField } from "../sceneobjects/game/GameField";
import { Hud } from "../sceneobjects/Hud";
import { AudioPlayer } from "../sceneobjects/AudioPlayer";

export class GameScene extends Phaser.Scene {

    private gameConfig: IGameConfig;
    private layouts: ILayouts;

    private gameField: GameField;
    private hud: Hud;
    private audioPlayer: AudioPlayer;
    private loader:LoaderView;

    constructor() {
        super("GameScene");
    }

    init(): void {
        this.audioPlayer = new AudioPlayer(this);
    }

    preload(): void {
        this.loader = new LoaderView(this);
        this.loader.onProgress(0);
        this.load.on('progress', this.loader.onProgress.bind(this.loader));

        this.load.image({key: "backgound", url: "assets/backgound.jpg"});
        this.load.atlas('sprites', 'assets/spritesheet.png', 'assets/sprites.json');

        this.load.json('gameConfig', 'configs/config.json');
        this.load.json('layouts', 'configs/layouts.json');
        this.audioPlayer.preloader();
    }

    create() {
        this.loader.onComplete();
        this.gameConfig = <IGameConfig>this.cache.json.get('gameConfig');
        this.layouts = this.cache.json.get('layouts');

        this.gameField = new GameField(this, this.gameConfig, this.layouts).create();
        this.hud = new Hud(this, this.gameConfig, this.layouts).create();
        this.audioPlayer.create();

        this.gameField.setScoreUpdateCallback((score: number) => {
            this.hud.setScore(score);
        });

        this.gameField.setGameStartCallback(() => {
            this.audioPlayer.onGameStart();
            this.hud.setScore(0);
        });

        this.gameField.setJumpCallback(() => {
            this.audioPlayer.onJump();
        });

        this.gameField.setFallCallback(() => {
            this.audioPlayer.onFall();
            setTimeout(() => {
                this.scene.stop("GameScene");
                this.scene.start("LoaderScene");
            }, 5000);
        });

        this.hud.onAutoChangeCallback((auto:boolean) => {
            this.gameField.setAutoMode(auto);
        });
    }

    update() {
        this.gameField.update();
    }

}