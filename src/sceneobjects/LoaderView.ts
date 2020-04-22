const barHeight = 50;
const barWidth = 640;

const loadTextStyle = {
    fontSize: '48px',
    fontFamily: 'press_start_2pregular',
    color: '#002844'
};
const loadingLabel = 'Loading... ';

export class LoaderView {

    private progressBar: Phaser.GameObjects.Graphics;
    private progressBox: Phaser.GameObjects.Graphics;
    private loadingText: Phaser.GameObjects.Text;

    private width: number;
    private height: number;

    constructor(private scene: Phaser.Scene) {
        this.width = this.scene.cameras.main.width;
        this.height = this.scene.cameras.main.height;

        this.progressBox = this.scene.add.graphics();
        this.progressBox.fillStyle(0x72e6f6, 0.8);
        this.progressBox.fillRect(
            (this.width - barWidth) / 2,
            this.height / 2 - 150,
            barWidth,
            barHeight
        );
        this.progressBar = this.scene.add.graphics();

        this.loadingText = this.scene.add.text(
            this.width / 2,
            this.height / 2,
            loadingLabel,
            loadTextStyle
        );
        this.loadingText.setOrigin(0.5, 1);
    }

    onProgress(value: number) {
        this.progressBar.clear();
        this.progressBar.fillStyle(0x002844, 1);
        this.progressBar.fillRect(
            (this.width - barWidth) / 2,
            this.height / 2 - 150,
            barWidth*value,
            barHeight
        );
        value = value * 100;
        this.loadingText.setText(loadingLabel + parseInt(value.toString()) + '%');
    };

    onComplete() {
        this.progressBar.destroy();
        this.progressBox.destroy();
        this.loadingText.destroy();
    };

}