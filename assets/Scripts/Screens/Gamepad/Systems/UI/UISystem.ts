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
import Layout = cc.Layout;

const {ccclass} = cc._decorator;

@ccclass
export default class UISystem extends cc.Component {

    public onChangeAvatarButtonClick: (avatarId) => void;
    public onChangeStateButtonClick: (isReady) => void;
    public onReconnectButtonClick: () => void;

    private _resources: GamepadScreenResources;
    private _gameManager: GameManager;

    private _connectingStage: cc.Node;
    private _errorStage: cc.Node;
    private _lobbyStage: cc.Node;
    private _gameStage: cc.Node;

    private _avatarSprite: Sprite;
    private _stateNode: cc.Node;
    private _canoeLayouts: Layout[];

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._resources = this.getComponent(GamepadScreenResources);
        this._gameManager = this.getComponent(GameManager);

        this._connectingStage = cc.find("Canvas/UI/ConnectingStage");
        this._errorStage = cc.find("Canvas/UI/ErrorStage");
        this._lobbyStage = cc.find("Canvas/UI/LobbyStage");
        this._gameStage = cc.find("Canvas/UI/GameStage");

        this._avatarSprite = cc.find("Canvas/UI/LobbyStage/AvatarButton/AvatarSprite").getComponent(Sprite);
        this._stateNode = cc.find("Canvas/UI/LobbyStage/State");
        this._canoeLayouts = [
            cc.find("Canvas/UI/GameStage/Canoe/Left").getComponent(Layout),
            cc.find("Canvas/UI/GameStage/Canoe/Right").getComponent(Layout)
        ];
    }

    public changeAvatar(avatarId: number) {
        this._avatarSprite.spriteFrame = this._resources.avatarFrames[avatarId];
    }

    public changeState(isReady: boolean) {
        this._stateNode.active = isReady;
    }

    public enableConnectingStage() {
        this.disableAllStages();
        this._connectingStage.active = true;
    }

    public enableErrorStage() {
        this.disableAllStages();
        this._errorStage.active = true;
    }

    public enableLobbyStage() {
        this.disableAllStages();
        this.changeState(!this._gameManager.User.isReady);
        this._lobbyStage.active = true;
    }

    public enableGameStage() {
        this.disableAllStages();
        this._gameStage.active = true;
    }

    public placeCanoePlayers(position: number, avatars: number[]) {
        this._canoeLayouts.forEach(layout => {
            layout.node.removeAllChildren(true);
        });

        for (let i = 0; i < avatars.length; i++) {
            let avatarId = avatars[i];

            let canoePlayer = cc.instantiate(this._resources.canoePlayerPrefab);
            canoePlayer.getComponent(Sprite).spriteFrame = this._resources.avatarFrames[avatarId];
            if (position === i) { canoePlayer.opacity = 255; } else  { canoePlayer.opacity = 63; }

            let canoeLayout = this._canoeLayouts[i % 2];
            canoeLayout.node.addChild(canoePlayer);
        }
    }

    private changeAvatarButtonClicked(event, customEventData) {
        let selectedAvatarId = (this._gameManager.User.avatarId + parseInt(customEventData)) % this._resources.avatarFrames.length;
        if (selectedAvatarId < 0) selectedAvatarId = this._resources.avatarFrames.length - 1;
        if (this.onChangeAvatarButtonClick !== undefined) this.onChangeAvatarButtonClick(selectedAvatarId);
    }

    private readyButtonClicked() {
        if (this.onChangeStateButtonClick !== undefined) this.onChangeStateButtonClick(true);
    }

    private unreadyButtonClicked() {
        if (!this._gameManager.User.isReady) return;
        if (this.onChangeStateButtonClick !== undefined) this.onChangeStateButtonClick(false);
    }

    private reconnectButtonClicked() {
        if (this.onReconnectButtonClick !== undefined) this.onReconnectButtonClick();
    }

    private disableAllStages() {
        this._connectingStage.active = false;
        this._errorStage.active = false;
        this._lobbyStage.active = false;
        this._gameStage.active = false;
    }
}
