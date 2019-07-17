// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Sprite = cc.Sprite;
import GamepadScreenResources from "../../GamepadScreenResources";
import GameManager from "../../../../Managers/Game/GameManager";
import Button = cc.Button;
import Label = cc.Label;

const {ccclass, property} = cc._decorator;

@ccclass
export default class UISystem extends cc.Component {

    public onChangeAvatarButtonClick: (avatarId) => void;
    public onChangeStateButtonClick: (isReady) => void;
    public onReconnectButtonClick: () => void;

    private _resources: GamepadScreenResources;
    private _gameManager: GameManager;

    private _connectingStage: cc.Node;
    private _disconnectedStage: cc.Node;
    private _lobbyStage: cc.Node;
    private _gameStage: cc.Node;

    private _avatarSprite: Sprite;
    private _stateButton: Button;
    private _stateButtonLabel: Label;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._resources = this.getComponent(GamepadScreenResources);
        this._gameManager = this.getComponent(GameManager);

        this._connectingStage = cc.find("Canvas/UI/ConnectingStage");
        this._disconnectedStage = cc.find("Canvas/UI/DisconnectedStage");
        this._lobbyStage = cc.find("Canvas/UI/LobbyStage");
        this._gameStage = cc.find("Canvas/UI/GameStage");

        this._avatarSprite = cc.find("Canvas/UI/LobbyStage/AvatarSprite").getComponent(Sprite);
        this._stateButton = cc.find("Canvas/UI/LobbyStage/StateButton").getComponent(Button);
        this._stateButtonLabel= cc.find("Canvas/UI/LobbyStage/StateButton/Background/Label").getComponent(Label);
    }

    start () {}

    public changeAvatar(avatarId: number) {
        this._avatarSprite.spriteFrame = this._resources.avatarFrames[avatarId];
    }

    public changeState(isReady: boolean) {
        let text = isReady ? "READY" : "UNREADY";
        this._stateButtonLabel.string = text;
    }

    public enableConnectingStage() {
        this.disableAllStages();
        this._connectingStage.active = true;
    }

    public enableDisconnectedStage() {
        this.disableAllStages();
        this._disconnectedStage.active = true;
    }

    public enableLobbyStage() {
        this.disableAllStages();
        this._lobbyStage.active = true;
    }

    public enableGameStage() {
        this.disableAllStages();
        this._gameStage.active = true;
    }

    private changeAvatarButtonClicked(event, customEventData) {
        let selectedAvatarId = (this._gameManager.User.avatarId + parseInt(customEventData)) % this._resources.avatarFrames.length;
        if (selectedAvatarId < 0) selectedAvatarId = this._resources.avatarFrames.length - 1;
        if (this.onChangeAvatarButtonClick !== undefined) this.onChangeAvatarButtonClick(selectedAvatarId);
    }

    private changeStateButtonClicked() {
        let currentState = this._gameManager.User.isReady;
        if (this.onChangeStateButtonClick !== undefined) this.onChangeStateButtonClick(!currentState);
    }

    private reconnectButtonClicked() {
        if (this.onReconnectButtonClick !== undefined) this.onReconnectButtonClick();
    }

    private disableAllStages() {
        this._connectingStage.active = false;
        this._disconnectedStage.active = false;
        this._lobbyStage.active = false;
        this._gameStage.active = false;
    }

    // update (dt) {}
}
