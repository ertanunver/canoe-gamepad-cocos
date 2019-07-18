// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import GamepadScreenResources from "./GamepadScreenResources";
import WebSocketManager from "../../Managers/WebSocket/WebSocketManager";
import UISystem from "./Systems/UI/UISystem";
import {ChangeAvatarMessage} from "./Systems/MessageFactory/Messages/ChangeAvatarMessage";
import {UserModel} from "../../Models/UserModel";
import GameManager from "../../Managers/Game/GameManager";
import {Helper} from "../../Helper";
import {ChangeStateMessage} from "./Systems/MessageFactory/Messages/ChangeStateMessage";
import MessageFactorySystem from "./Systems/MessageFactory/MessageFactorySystem";
import log = cc.log;
import SwipeSystem from "./Systems/Swipe/SwipeSystem";
import {SwipeMessage} from "./Systems/MessageFactory/Messages/SwipeMessage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GamepadScreen extends cc.Component {

    private _resources: GamepadScreenResources;

    private _gameManager: GameManager;
    private _wsManager: WebSocketManager;


    private _uiSystem: UISystem;
    private _messageFactorySystem: MessageFactorySystem;
    private _swipeSystem: SwipeSystem;

    private _userModel: UserModel;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._resources = this.getComponent(GamepadScreenResources);

        this._gameManager = this.getComponent(GameManager);
        this._wsManager = this.getComponent(WebSocketManager);

        this._wsManager.onConnect = () => this.onConnect();
        this._wsManager.onDisconnect = () => this.onDisconnect();
        this._wsManager.onErrorOccur = () => this.onErrorOccur();
        this._wsManager.onMessageReceive = (data: string) => this.onMessageReceive(data);

        this._uiSystem = this.getComponent(UISystem);
        this._messageFactorySystem = this.getComponent(MessageFactorySystem);
        this._swipeSystem = this.getComponent(SwipeSystem);

        this._uiSystem.onChangeAvatarButtonClick = (avatarId) => this.onChangeAvatarButtonClick(avatarId);
        this._uiSystem.onChangeStateButtonClick = (isReady) => this.onChangeStateButtonClick(isReady);
        this._uiSystem.onReconnectButtonClick = () => this.onReconnectButtonClick();
        this._messageFactorySystem.onStartGameMessage = () => this.onStartGameMessage();
        this._swipeSystem.onUpSwipe = () => this.onUpSwipe();
        this._swipeSystem.onDownSwipe = () => this.onDownSwipe();

        this._userModel = new UserModel();
    }

    start() {
        this.connect();
    }

    private connect() {
        let host = Helper.getURLHost();
        let port = 81;

        this._uiSystem.enableConnectingStage();
        this._wsManager.connect(host, port);
    }

    private onConnect() {
        this._uiSystem.enableLobbyStage();
        // set avatar randomly
        this._uiSystem.changeAvatar(this._gameManager.User.avatarId);
        this._wsManager.send(new ChangeAvatarMessage(this._gameManager.User.avatarId));
    }

    private onDisconnect() {
        this._uiSystem.enableDisconnectedStage();
    }

    private onErrorOccur() {
        console.log("onErrorOccur");
    }

    private onMessageReceive(data: string) {
        console.log(data);
        let message = JSON.parse(data);
        this._messageFactorySystem.produce(message.code, data);
    }

    private onChangeAvatarButtonClick(avatarId: number) {
        this._gameManager.User.avatarId = avatarId;
        this._uiSystem.changeAvatar(avatarId);
        this._wsManager.send(new ChangeAvatarMessage(avatarId));
    }

    private onChangeStateButtonClick(isReady: boolean) {
        this._gameManager.User.isReady = isReady;
        this._uiSystem.changeState(!isReady);
        this._wsManager.send(new ChangeStateMessage(isReady));
    }

    private onReconnectButtonClick() {
        this.connect();
    }

    private onStartGameMessage() {
        this._uiSystem.enableGameStage();
    }

    private onUpSwipe() {
        this._wsManager.send(new SwipeMessage("up"))
    }

    private onDownSwipe() {
        this._wsManager.send(new SwipeMessage("down"))
    }

    private createUserModel() {
        this._userModel = new UserModel();
    }
    // update (dt) {}
}
