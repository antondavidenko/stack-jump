const baseTween = {
    duration: 600,
    ease: 'Power1'
}

export function setCameraZoom():void {
    setTargetZoom.call(this, getFirstPlanZoomByConter.call(this), firstPlanContainerStartTwen);
    setTargetZoom.call(this, getSecondPlanZoomByConter.call(this), secondPlanContainerStartTwen);
}

function setTargetZoom(zoom:number, zoomAnimation:()=>void):void {
    let originH = this.scene.cameras.main.height;
    let newH = originH*(1/zoom);
    let originW = this.scene.cameras.main.width;
    let newW = originW*(1/zoom);
    zoomAnimation.call(this, {scale: zoom, x:(newW - originW)*zoom/2, y:(newH - originH)*zoom});
}

export function goingUpOnDemand(character) {
    if (character.y < 800) {
        let targetY = this.firstPlanContainer.y + this.gameConfig.platformDeltaUp;
        firstPlanContainerStartTwen.call(this, {y: targetY});

        let targetY2 = this.secondPlanContainer.y + this.gameConfig.platformDeltaUp/5;
        secondPlanContainerStartTwen.call(this, {y: targetY2});
    }
}

function getFirstPlanZoomByConter():number {
    return this.counter<5 ? 1 : 5/this.counter;
}

function firstPlanContainerStartTwen(params: any):void {
    this.scene.tweens.add({...params, targets: this.firstPlanContainer, ...baseTween});
}

function getSecondPlanZoomByConter():number {
    return this.counter<25 ? 1 : 25/this.counter;
}

function secondPlanContainerStartTwen(params: any):void {
    this.scene.tweens.add({...params, targets: this.secondPlanContainer, ...baseTween});
}