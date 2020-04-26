export interface ILayouts {
    gameField: IGameField;
    hud: IHudLayout;
}

export interface IGameField {
    player: IPoint
};

export interface IHudLayout {
    info_label: IPoint,
    score_label: IPoint,
    auto_button: IPoint,
    install_button: IPoint,
    restart_button: IPoint
};

export interface IPoint {
    x: number, 
    y: number
}