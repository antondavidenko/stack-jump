export interface IGameConfig {
    iOSInstall: string,
    AndroidInstall: string,

    playerJumpVelocity: number;
    autoJumpMinDistance: number;
    autoJumpMaxDistance: number;

    platform: IPlargormConfig;

    gameRestartDelay: number;
}

export interface IPlargormConfig {
    firstTimeSpawnDelay: number;
    minSpawnDelay: number;
    maxSpawnDelay: number;

    speed: number;
    spawnXRight: number;
    spawnXLeft: number;
    spawnY: number;
    deltaUp: number;
}