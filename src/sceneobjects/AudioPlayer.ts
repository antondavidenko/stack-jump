export class AudioPlayer {

    private theme: Phaser.Sound.BaseSound;
    private fall: Phaser.Sound.BaseSound;
    private jump: Phaser.Sound.BaseSound;

    constructor(private scene: Phaser.Scene) {}

    preloader() {
        this.scene.load.audio('theme', ['assets/audio/theme.mp3']);
        this.scene.load.audio('screaming', ['assets/audio/screaming.mp3']);
        this.scene.load.audio('jump', ['assets/audio/jump.mp3']);
    }

    create() {
        this.theme = this.scene.sound.add('theme', { loop: true });
        this.fall = this.scene.sound.add('screaming');
        this.jump = this.scene.sound.add('jump');
    }

    onGameStart() {
        this.theme.play();
    }

    onJump() {
        this.jump.play();
    }

    onFall() {
        this.fall.play();
        this.theme.stop();
    }

}