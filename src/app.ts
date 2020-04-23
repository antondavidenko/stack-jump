import "phaser";
import { GameScene } from "./scenes/gameScene";

let dapi = (window as any).dapi;

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
    scene: [GameScene]
};

export class tdOrcsGame extends Phaser.Game {
    constructor() {
        super(tdGameConfig);
    }
}

window.onload = () => {
    let game = new tdOrcsGame();
    if (dapi !== undefined) {
        (dapi.isReady()) ? onReadyCallback() : dapi.addEventListener("ready", onReadyCallback);
    }
};

function onReadyCallback(){
	//no need to listen to this event anymore
	dapi.removeEventListener("ready", onReadyCallback);
    let isAudioEnabled = !!dapi.getAudioVolume();

	if(dapi.isViewable()){
		adVisibleCallback({isViewable: true});
	}

	dapi.addEventListener("viewableChange", adVisibleCallback);
	dapi.addEventListener("adResized", adResizeCallback);
      dapi.addEventListener("audioVolumeChange",         audioVolumeChangeCallback);
}

function adVisibleCallback(event){
	console.log("isViewable " + event.isViewable);
	if (event.isViewable){
		let screenSize = dapi.getScreenSize();
		//START or RESUME the ad
	} else {
		//PAUSE the ad and MUTE sounds
	}
}

function adResizeCallback(event){
	let screenSize = event;
	console.log("ad was resized width " + event.width + " height " + event.height);
}

function audioVolumeChangeCallback(volume){
	let isAudioEnabled = !!volume;
	if (isAudioEnabled){
		//START or turn on the sound
	} else {
		//PAUSE the turn off the sound
	}
}